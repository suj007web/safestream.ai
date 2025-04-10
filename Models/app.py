# from flask import Flask, request, jsonify
# import cv2
# import yt_dlp
# import os

# from videoClassify import VideoFrameClassification

# app = Flask(__name__)

# # Define a folder where the videos will be saved
# DOWNLOAD_FOLDER = './downloads'
# if not os.path.exists(DOWNLOAD_FOLDER):
#     os.makedirs(DOWNLOAD_FOLDER)

# # Endpoint to download YouTube video
# @app.route('/download', methods=['POST'])
# def download_video():
#     try:
#         data = request.get_json()
#         video_url = data.get('url')
#         ydl_opts = {
#             'format': 'mp4',  # Ensure the format is mp4
#             'outtmpl': '%(title)s.%(ext)s',  # Output file name format
#         }

#         try:
#             with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#                 # Download the video and get the download path
#                 info_dict = ydl.extract_info(video_url, download=True)
#                 video_path = ydl.prepare_filename(info_dict)
#                 return jsonify({'message': 'Video download successful','filePath':video_path}), 200 
#             print(f"Download complete: {video_path}")
#         except Exception as e:
#             print(f"Error: {e}")

                
#         print("hii video downmlaod")

#     except Exception as e:
#         return jsonify({'message': str(e)}), 500

# # Endpoint to analyze the video (mock analysis)
# @app.route('/analyse', methods=['POST'])
# def analyse_video():
#     try:
#         data = request.get_json()
#         file_path = data.get('filePath')

#         if not file_path or not os.path.exists(file_path):
#             return jsonify({'message': 'Video file not found'}), 404
        
        
        
        
#         video_capture = cv2.VideoCapture(file_path)
#         fps = video_capture.get(cv2.CAP_PROP_FPS)
#         results = []
#         time_index = []

#         frame_index = 0
#         end_time = 0

#         while frame_index < video_capture.get(cv2.CAP_PROP_FRAME_COUNT):
#             ret, frame = video_capture.read()

#             if not ret:
#                 break

#             classification_result = VideoFrameClassification(frame)
#             results.append([classification_result, frame_index])
#             frame_index += 1

#         video_capture.release()

#         def next_zero(index):
#             for i in results[index:]:
#                 if i[0] == 0 or i[0] == 1:
#                     if i[1] < fps:
#                         return 0
#                     else:
#                         return i[1]
#             return -1

#         for i in results:
#             if i[1] >= end_time:
#                 if i[0] == 2:
#                     if i[1] < fps:
#                         start_time = 0
#                         end_time = next_zero(i[1]) / fps if next_zero(i[1]) != 0 else video_capture.get(
#                             cv2.CAP_PROP_FRAME_COUNT) / fps
#                     else:
#                         start_time = i[1] / fps
#                         end_time = next_zero(i[1]) / fps if next_zero(i[1]) != 0 else video_capture.get(
#                             cv2.CAP_PROP_FRAME_COUNT) / fps

#                     if start_time < end_time and start_time != end_time:
#                         if time_index and start_time - time_index[-1][1] <= 2:
#                             time_index[-1] = (time_index[-1][0], end_time)
#                         else:
#                             time_index.append((start_time, end_time))

#         time_index = [(round(start), round(end)) for start, end in time_index]

#         print(time_index)

#         return jsonify({'message': 'Video analysis successful', 'result': time_index}), 200
#     except Exception as e:
#         print(f"Error in classification: {str(e)}")
#         return "Cannot be analyzed"


        

#     except Exception as e:
#         return jsonify({'message': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
import os
import requests
import yt_dlp
import cv2
from videoClassify import VideoFrameClassification
import threading
app = Flask(__name__)

# folder where the videos will be saved
DOWNLOAD_FOLDER = './downloads'
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

# Google's OAuth2 token validation URL
GOOGLE_OAUTH2_VALIDATION_URL = "https://oauth2.googleapis.com/tokeninfo"

def process_downloaded_video(file_path, webhook_url, video_url, user_email):
    try:
        if not file_path or not os.path.exists(file_path):
            print("File not found")
            return 

        video_capture = cv2.VideoCapture(file_path)
        fps = video_capture.get(cv2.CAP_PROP_FPS)
        results = []
        time_index = []

        frame_index = 0
        end_time = 0

        while frame_index < video_capture.get(cv2.CAP_PROP_FRAME_COUNT):
            ret, frame = video_capture.read()

            if not ret:
                break

            classification_result = VideoFrameClassification(frame)
            results.append([classification_result, frame_index])
            frame_index += 1

        video_capture.release()

        def next_zero(index):
            for i in results[index:]:
                if i[0] == 0 or i[0] == 1:
                    if i[1] < fps:
                        return 0
                    else:
                        return i[1]
            return -1

        for i in results:
            if i[1] >= end_time:
                if i[0] == 2:
                    if i[1] < fps:
                        start_time = 0
                        end_time = next_zero(i[1]) / fps if next_zero(i[1]) != 0 else video_capture.get(
                            cv2.CAP_PROP_FRAME_COUNT) / fps
                    else:
                        start_time = i[1] / fps
                        end_time = next_zero(i[1]) / fps if next_zero(i[1]) != 0 else video_capture.get(
                            cv2.CAP_PROP_FRAME_COUNT) / fps

                    if start_time < end_time and start_time != end_time:
                        if time_index and start_time - time_index[-1][1] <= 2:
                            time_index[-1] = (time_index[-1][0], end_time)
                        else:
                            time_index.append((start_time, end_time))

        time_index = [(round(start), round(end)) for start, end in time_index]
        if webhook_url:
            payload = {
                "status": "success",
                "message": "Video analysis successful",
                "result": time_index,
                "videoUrl" : video_url,
                "filePath" : file_path,
                "userEmail" : user_email
            }
        headers = {"Content-Type": "application/json"}
        response = requests.post(webhook_url, json=payload, headers=headers)
        print(f"Webhook Response: {response.status_code}, {response.text}")
        print(time_index)
    except Exception as e:
        print(f"Error in classification: {str(e)}")    
        payload = {
            "status": "failed",
            "message": "Error analyzing video",
            "error": str(e)
        }    
        headers = {"Content-Type": "application/json"}
        response = requests.post(webhook_url, json=payload, headers=headers)
        print(f"Webhook Response: {response.status_code}, {response.text}")


# Function to validate access token
def validate_access_token(access_token):
    # Send a request to Google OAuth2 API to validate the token
    response = requests.get(GOOGLE_OAUTH2_VALIDATION_URL, params={"id_token": access_token})
    if response.status_code == 200:
        # If the token is valid, the response will include user info
        user_info = response.json()
        return user_info  
    else:
        # Token is invalid or expired
        return None

#download YouTube video
@app.route('/download', methods=['POST'])
def download_video():
    try:
        # Authorization header
        # auth_header = request.headers.get('Authorization')
        # if not auth_header:
        #     return jsonify({'message': 'Authorization header is missing'}), 401
        
        # # Extract the access token
        # access_token = auth_header.split("Bearer ")[-1]
        
        # # Validate the access token
        # user_info = validate_access_token(access_token)
        # if not user_info:
        #     return jsonify({'message': 'Invalid or expired access token'}), 401

        # If token is valid, proceed with video download
        data = request.get_json()
        video_url = data.get('videoUrl')
        webhook_url = data.get('webhookUrl')
        user_email = data.get('userEmail')
        ydl_opts = {
            'format': 'mp4',  # Ensure the format is mp4
            'outtmpl': '%(title)s.%(ext)s',  # Output file name format
        }

        def process_video():
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info_dict = ydl.extract_info(video_url, download=True)
                    video_path = ydl.prepare_filename(info_dict)

                print(f"Download complete: {video_path}")

                # Send a webhook notification
                webhook_data = {
                    "status": "success",
                    "message": "Video download successful",
                    "filePath": video_path,
                    "videoUrl": video_url,
                    "userEmail": user_email  
                }
                requests.post(webhook_url, json=webhook_data)

            except Exception as e:
                print(f"Error: {e}")
                error_data = {
                    "status": "failed",
                    "message": "Error downloading video",
                    "error": str(e)
                }
                requests.post(webhook_url, json=error_data)
         
        threading.Thread(target=process_video).start()      

        return jsonify({'message': 'Video processing started'}), 200        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Endpoint to analyze the video (mock analysis)
@app.route('/analyse', methods=['POST'])
def analyse_video():
    try:
        data = request.get_json()
        file_path = data.get('filePath')
        webhook_url = data.get('webhookUrl')
        video_url = data.get('videoUrl')
        user_email = data.get('userEmail');

        if not file_path or not os.path.exists(file_path):
            print(file_path)
            return jsonify({'message': 'Video file not found'}), 404

        thread = threading.Thread(target=process_downloaded_video, args=(file_path, webhook_url, video_url, user_email))
        thread.start()

        return jsonify({'message': 'Video analysis started'}), 202
    except Exception as e:
        print(f"Error in classification: {str(e)}")
        return "Cannot be analyzed"


if __name__ == '__main__':
    app.run(debug=True)
