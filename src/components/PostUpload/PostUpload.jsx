import React from 'react'
import user from '../../assets/images/user.JPG'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
export default function PostUpload() {
  return (
    <section className='mt-8'>
        <form className="container mx-auto max-w-2xl bg-white rounded-2xl shadow-lg p-5">
          <header className="flex items-center space-x-4 mb-4">
            <div className="avatar border-3 rounded-full border-blue-300">
                <img src={user} alt="User Avatar" className="w-12 h-12 rounded-full object-cover object-center" />
            </div>
            <div className="author">
                <h2 className="text-lg font-semibold">Create Post</h2>
                <p className="text-sm text-gray-600">Share your thoughts with the world</p>
            </div>
          </header>
          <textarea name="postContent" id="postContent" placeholder='Whats on your mind?' className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          <div className="flex justify-between items-center border-t border-gray-400/30 mt-4 pt-4">
            <label className="border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:scale-105 hover:transition-transform hover:duration-200" htmlFor="image">
                <div className='space-x-1'>
                    <FontAwesomeIcon icon={fas.faImage} className="text-blue-500" />
                    <span>Photo</span>
                </div>
                <input type="file" className='hidden' name="" id="image" />
            </label>
            <button type="submit" className="space-x-1 bg-linear-to-r from-blue-700 to-blue-500 text-white hover:scale-105 hover:transition-transform hover:duration-200 hover:bg-linear-to-r hover:from-blue-500 hover:to-blue-400 px-4 py-2 rounded-lg cursor-pointer">
                <span>Post</span>
                <FontAwesomeIcon icon={fas.faPaperPlane} />
            </button>
          </div>
        </form>
    </section>
  )
}
