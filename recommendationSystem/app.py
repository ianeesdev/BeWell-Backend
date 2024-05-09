# Import necessary modules
from bson import ObjectId
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
    
    # Return list of post objects with all required data
    recommended_posts = []
    for idx in post_indices:
        post_data = posts_df.iloc[idx]
        author_id = post_data["author"]
        author_data = users_collection.find_one({"_id": author_id})
        comments = post_data.get("comment", [])
        if author_data:
            recommended_posts.append({
                "_id": str(post_data["_id"]),
                "isAnonymous": bool(post_data["isAnonymous"]),
                "text": post_data["text"],
                "author": {
                    "_id": str(author_id),
                    "username": author_data["username"]
                },
                "comment": comments
            })
    
    return recommended_posts

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define endpoint to get recommendations for a user
@app.route("/recommendations")
def recommendations():
    user_id = request.args.get("user_id")
    try:
        recommended_posts = get_recommendations(user_id)
        return jsonify(recommended_posts)
    except Exception as e:
        error_message = {"error": str(e)}
        print(error_message)
        return jsonify(error_message), 500

if __name__ == "__main__":
    app.run(debug=True)
