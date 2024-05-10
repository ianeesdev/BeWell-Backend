from pymongo import MongoClient
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from flask import Flask, jsonify, request
from flask_cors import CORS

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://aneese421:lDX9jIqX7bRlYygi@cluster0.6hultuo.mongodb.net/Bewell?retryWrites=true&w=majority")
db = client["Bewell"]
users_collection = db["users"]
posts_collection = db["posts"]

# Fetch data from MongoDB and store it in pandas DataFrames
users_data = list(users_collection.find())
posts_data = list(posts_collection.find())

users_df = pd.DataFrame(users_data)
posts_df = pd.DataFrame(posts_data)

# Preprocess data if needed convert text data to numerical representations using TF-IDF
tfidf = TfidfVectorizer(stop_words='english')
post_text_matrix = tfidf.fit_transform(posts_df['text'])

# Implement recommendation algorithm, use cosine similarity for content-based filtering
cosine_sim = linear_kernel(post_text_matrix, post_text_matrix)


from bson import ObjectId
# Generate recommendations
def get_recommendations(user_id, cosine_sim=cosine_sim, n=5):
    # Convert string user ID to BSON ObjectId
    user_id = ObjectId(user_id)
    
    # Find the user index in the DataFrame
    user_index = users_df[users_df["_id"] == user_id].index
    if len(user_index) == 0:
        return []  # Return empty list if user not found
    
    user_index = user_index[0]
    user_posts_indices = users_df.iloc[user_index]["posts"]
    user_posts_indices = [posts_df[posts_df["_id"] == post_id].index[0] for post_id in user_posts_indices]
    sim_scores = cosine_sim[user_posts_indices].sum(axis=0)
    sim_scores = list(enumerate(sim_scores))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = [i for i in sim_scores if i[0] not in user_posts_indices]  # Exclude user's own posts
    sim_scores = sim_scores[:n]
    post_indices = [i[0] for i in sim_scores]
    
    # Return list of post IDs
    return [posts_df.iloc[idx]["_id"] for idx in post_indices]


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define endpoint to get recommendations for a user
@app.route("/recommendations")
def recommendations():
    user_id = request.args.get("user_id")
    recommended_post_ids = get_recommendations(user_id)
    
    # Retrieve post objects from DataFrame using post indices
    recommended_posts = [posts_collection.find_one({"_id": ObjectId(post_id)}) for post_id in recommended_post_ids]
    
    # Convert the list of recommended posts to a JSON format
    recommended_posts_json = []
    for post in recommended_posts:
        post_dict = {
            "_id": str(post["_id"]),
            "text": post["text"],
        }
        recommended_posts_json.append(post_dict)
    
    return jsonify(recommended_posts_json)

if __name__ == "__main__":
    app.run(debug=True, port=5011)