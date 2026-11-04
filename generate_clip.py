import os
import sys
import json
import time
import random
import requests

COMFY_URL = "http://127.0.0.1:8188"

def generate_video(image_path, prompt_text, camera_pose, output_path):
    print(f"\n==========================================")
    print(f"Starting Video Generation:")
    print(f"Image: {image_path}")
    print(f"Prompt: {prompt_text}")
    print(f"Camera: {camera_pose}")
    print(f"Output: {output_path}")
    print(f"==========================================")
    
    # 1. Upload image
    basename = os.path.basename(image_path)
    mime = "image/jpeg" if basename.lower().endswith((".jpg", ".jpeg")) else "image/png"
    with open(image_path, "rb") as f:
        r = requests.post(f"{COMFY_URL}/upload/image", files={"image": (basename, f, mime)})
        r.raise_for_status()
        uploaded_name = r.json()["name"]
        print(f"Uploaded as: {uploaded_name}")

    # 2. Load template workflow
    with open("wan_workflow_template.json", "r", encoding="utf-8") as f:
        wf = json.load(f)

    # 3. Configure workflow
    wf["7"]["inputs"]["image"] = uploaded_name
    wf["4"]["inputs"]["text"] = prompt_text
    wf["9"]["inputs"]["camera_pose"] = camera_pose
    wf["12"]["inputs"]["seed"] = random.randint(100000000000000, 999999999999999)
    wf["14"]["inputs"]["filename_prefix"] = f"wan_{os.path.splitext(os.path.basename(output_path))[0]}"

    # 4. Queue prompt
    print("Submitting prompt to ComfyUI...")
    r = requests.post(f"{COMFY_URL}/prompt", json={"prompt": wf})
    r.raise_for_status()
    prompt_res = r.json()
    prompt_id = prompt_res["prompt_id"]
    print(f"Queued successfully! Prompt ID: {prompt_id}")

    # 5. Poll for completion
    start_time = time.time()
    last_print = 0
    while True:
        time.sleep(3)
        elapsed = time.time() - start_time
        
        try:
            r = requests.get(f"{COMFY_URL}/history/{prompt_id}")
            if r.status_code == 200:
                hist = r.json()
                if prompt_id in hist:
                    data = hist[prompt_id]
                    outputs = data.get("outputs", {})
                    # Look for video output
                    found_file = None
                    for nid, nout in outputs.items():
                        gifs = nout.get("gifs", []) or nout.get("videos", []) or nout.get("images", [])
                        for item in gifs:
                            if item.get("filename", "").endswith((".webm", ".mp4")):
                                found_file = item
                                break
                        if found_file:
                            break
                    
                    if found_file:
                        fn = found_file["filename"]
                        sub = found_file.get("subfolder", "")
                        t = found_file.get("type", "output")
                        view_url = f"{COMFY_URL}/view?filename={fn}&subfolder={sub}&type={t}"
                        print(f"\nCompleted in {elapsed:.1f}s! Downloading {fn}...")
                        v_res = requests.get(view_url)
                        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
                        with open(output_path, "wb") as out_f:
                            out_f.write(v_res.content)
                        print(f"Saved to {output_path} ({os.path.getsize(output_path)} bytes)")
                        return True
        except Exception as e:
            print(f"Polling warning: {e}")

        if elapsed - last_print >= 15:
            last_print = elapsed
            print(f"  Rendering in progress... {elapsed:.0f}s elapsed")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python generate_clip.py <image_path> <prompt> <camera> <output_path>")
        sys.exit(1)
    generate_video(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
