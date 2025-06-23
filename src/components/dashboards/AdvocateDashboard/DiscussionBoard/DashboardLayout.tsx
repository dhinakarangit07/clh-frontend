import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

const DiscussionBoard: React.FC = () => {
  const [postContent, setPostContent] = useState('');

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handlePostSubmit = () => {
    // Placeholder for submitting a new post
    alert('Post submitted!');
    setPostContent('');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>
      {/* Header */}
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Discussion Board</h1>
          <p className="mt-2 text-lg">Join the Conversation, Share Your Ideas</p>
        </div>
      </header>

      {/* Create Post Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Start a New Discussion</h2>
          <div className="max-w-2xl mx-auto">
            <textarea
              value={postContent}
              onChange={handlePostChange}
              placeholder="What's on your mind? Share your thoughts..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
            ></textarea>
            <button
              onClick={handlePostSubmit}
              className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        </div>
      </section>

      {/* Discussion Threads Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Recent Discussions
          </h2>
          <div className="space-y-6">
            {/* Thread 1 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Best Practices for Remote Work
              </h3>
              <p className="text-gray-600 mb-2">Posted by: Jane Smith | June 17, 2025</p>
              <p className="text-gray-600">
                Looking for tips on staying productive while working from home. Any advice on managing distractions?
              </p>
              <div className="mt-4 flex space-x-4">
                <button className="text-blue-600 hover:underline">View 12 Replies</button>
                <button className="text-blue-600 hover:underline">Reply</button>
              </div>
            </div>
            {/* Thread 2 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                New Tech Trends for 2025
              </h3>
              <p className="text-gray-600 mb-2">Posted by: Alex Johnson | June 16, 2025</p>
              <p className="text-gray-600">
                What emerging technologies are you excited about this year? Let’s discuss AI, blockchain, and more!
              </p>
              <div className="mt-4 flex space-x-4">
                <button className="text-blue-600 hover:underline">View 8 Replies</button>
                <button className="text-blue-600 hover:underline">Reply</button>
              </div>
            </div>
            {/* Thread 3 */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sustainability in Business
              </h3>
              <p className="text-gray-600 mb-2">Posted by: Maria Lopez | June 15, 2025</p>
              <p className="text-gray-600">
                How can small businesses adopt sustainable practices without breaking the bank?
              </p>
              <div className="mt-4 flex space-x-4">
                <button className="text-blue-600 hover:underline">View 5 Replies</button>
                <button className="text-blue-600 hover:underline">Reply</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-6">
            Engage with like-minded individuals, share knowledge, and grow together.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Discussion Board. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DiscussionBoard;