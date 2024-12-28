"use client"
import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetchComments();
    fetchLikes();
  }, []);

  const fetchComments = async () => {
    const res = await fetch('/api/comments');
    const data = await res.json();
    setComments(data);
  };

  const fetchLikes = async () => {
    const res = await fetch('/api/likes');
    const data = await res.json();
    setLikes(data.count);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment, author }),
    });

    setNewComment('');
    fetchComments();
  };

  return (
    <div className="w-full max-w-4xl mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Community Comments</h3>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg"
            onClick={() => fetch('/api/likes', { method: 'POST' }).then(fetchLikes)}
          >
            <ThumbsUp className="h-4 w-4" />
            {likes} Likes
          </button>
        </div>

        <form onSubmit={handleSubmitComment} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Post
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-3">
              <div className="flex justify-between">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
