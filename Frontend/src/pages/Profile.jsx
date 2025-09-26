import React, { useEffect, useState } from 'react'
import NavBar from '../Dashboard/NavBar'
import { useAuth } from '../Context/AuthProvider';
import img2 from './../assets/img.jpg'
import UpdateModel from './UpdateModel';
import { useDataContext } from '../Context/DataProvider';
import AllPosts from '../Users/Posts';
import UpdateProfile from './UpdateProfile';
import { useNavigate } from 'react-router';
import PostCard from '../Dashboard/PostCard';
import toast, { Toaster } from 'react-hot-toast';
import CreatePost from '../Dashboard/CreatePost';
import About from './About';
import Loading from '../Dashboard/Loading';
import { useConnections } from '../Context/ConnectionsProvider';
import RightSideBar from './RightSideBar';
import LeftSidebar from './LeftSidebar';
import AllUsers from '../Users/Users';
import { AchievementsModal, SkillsModal } from '../Modals/SkillsModal';
import ReactMarkdown from "react-markdown";


export default function Profile() {
  const [authUser, setAuthUser] = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, setIsOpen, location, isOpenAbout, setIsOpenAbout, openUpdateEduForm, setOpenUpdateEduForm, currUserProfile, setCurrUserProfile, postForm, setPostForm } = useDataContext();
  const [allPosts] = AllPosts();
  const [openProfile, setOpenProfile] = useState(false);
  const [openCover, setOpenCover] = useState(false);
  const [allUsers] = AllUsers();
  const [formData, setFormData] = useState({
    profilePicture: null,
    coverPicture: null,
  });
  const { myConnections } = useConnections();
  const navigate = useNavigate();

  // Guard if authUser not ready
  if (!authUser || !authUser.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const myPosts = allPosts?.filter((posts) => posts.userId?._id === authUser.user._id) || [];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = authUser.token ? authUser.token : authUser.user.token;

    const imgData = new FormData();
    if (formData.profilePicture) {
      imgData.append('profilePicture', formData.profilePicture);
    }
    if (formData.coverPicture) {
      imgData.append('coverPicture', formData.coverPicture);
    }

    try {
      const response = await fetch('/api/upload_Profile', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: imgData,
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setAuthUser((prev) => ({ ...prev, ...data }));
        try {
          const stored = JSON.parse(localStorage.getItem('user')) || {};
          localStorage.setItem('user', JSON.stringify({ ...stored, ...data }));
        } catch (err) {
          localStorage.setItem('user', JSON.stringify(data));
        }
        toast.success('Profile Updated');
      } else {
        toast.error(data.msg || 'Update failed');
      }

      setTimeout(() => {
        setOpenProfile(false);
        setOpenCover(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error('Server error');
    }
  };

  const updateEducation = async () => {
    setOpenUpdateEduForm(true);
  };

  const openPosts = (id) => {
    navigate(`/userProfile/${id}/posts`);
  };

  const imagePreview = formData.profilePicture
    ? URL.createObjectURL(formData.profilePicture)
    : authUser.user.profilePicture;

  const coverPreview = formData.coverPicture
    ? URL.createObjectURL(formData.coverPicture)
    : authUser.img;

  const id = authUser.user._id;
  useEffect(() => {
    if (id) {
      const getUserProfile = async () => {
        try {
          let result = await fetch(`/api/getProfile?id=${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await result.json();
          setCurrUserProfile(data.profile);
        } catch (err) {
          console.error('getProfile error', err);
        }
      };
      getUserProfile();
    }
  }, [id, setCurrUserProfile]);

  const acceptedConnections = myConnections?.filter((conn) => conn.status_accepted === true) || [];
  const connections = acceptedConnections?.map((conn) => {
    const otherUser = conn.userId._id === authUser?.user._id ? conn.connectionId : conn.userId;
    return otherUser;
  });

  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <Toaster />
      <NavBar />

      <div className="max-w-6xl mx-auto p-6 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Left Sidebar (visible md+) */}
          <div className="hidden md:block md:col-span-1">
            {currUserProfile && <LeftSidebar user={currUserProfile} />}
          </div>

          {/* Center */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-xl shadow relative overflow-hidden">
            <div className="relative">
              {/* Cover Image */}
              {authUser?.img ? (
                <img
                  src={authUser.img}
                  alt="cover"
                  className="w-full h-40 sm:h-32 md:h-44 object-cover rounded-t-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img src={img2} alt="cover" className="w-full h-40 sm:h-32 md:h-48  object-cover rounded-t-xl" />
              )}

              {/* Camera icon */}
              <div
                className="absolute top-2 right-2 bg-white text-gray-700 hover:bg-gray-100 p-2 rounded-full shadow cursor-pointer"
                title="Change background image"
                onClick={() => setOpenCover(true)}
              >
                <i className="fa-solid fa-camera text-lg"></i>
              </div>

              {/* Profile picture */}
              <div className="absolute left-6 -bottom-10">
                <img
                  onClick={() => setOpenProfile(true)}
                  referrerPolicy="no-referrer"
                  src={authUser.user.profilePicture}
                  alt="profile"
                  className="rounded-full h-[120px] w-[120px] sm:h-[96px] sm:w-[96px] md:h-[120px] md:w-[120px] border-4 border-white object-cover cursor-pointer"
                />

                <div className="absolute -top-2 left-0 bg-green-600 text-white px-2 py-0.5 text-xs rounded-full">#OPENTOWORK</div>
              </div>
            </div>

            <div className="p-6 pt-14 sm:p-4 sm:pt-12">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl md:text-2xl font-bold">
                  {authUser.user.name} <span className="text-sm font-normal">(He/Him)</span>
                </h2>
                <i onClick={() => setIsOpen(true)} className="text-xl fa-solid fa-pencil rounded-full p-2 hover:bg-gray-100 cursor-pointer"></i>
              </div>

              <p className="text-base sm:text-sm mt-2">{authUser.user.bio}</p>
              <p className="text-sm text-gray-500 mt-1">{location || 'No location avl'}</p>
              <p className="text-sm text-blue-600 mt-1 font-semibold">{connections?.length} Connections</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">Open to</button>
                <a href="#enhanceProfile">
                  <button className="border border-gray-400 px-4 py-2 rounded-full text-sm">Enhance profile</button>
                </a>
              </div>
            </div>
          </div>

          {/* Right Sidebar (visible lg+) */}
          <div className="hidden lg:block lg:col-span-1">
            {allUsers.length > 0 && <RightSideBar allUsers={allUsers} />}
          </div>
        </div>

        {/* About Section */}
        <section className="bg-white rounded-xl shadow p-6 sm:p-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-800">About</h2>
            <button onClick={() => setIsOpenAbout(true)} className="p-2 rounded-full hover:bg-gray-100 transition" title="Edit About">
              <i className="fa-solid fa-pencil text-gray-600"></i>
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed">{<ReactMarkdown>{currUserProfile?.about}</ReactMarkdown> || 'No about information yet. Add something here ✨'}</p>
        </section>

        {/* Skills */}
        <section className="bg-white rounded-xl shadow p-6 sm:p-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <i onClick={() => setIsSkillsOpen(true)} className="fa-solid fa-plus text-lg p-2 rounded-full hover:bg-gray-50 cursor-pointer"></i>
          </div>
          <div className="flex flex-wrap gap-2">
            {currUserProfile?.skills && currUserProfile.skills.length > 0 ? (
              currUserProfile.skills.map((skill, index) => (
                <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{skill}</div>
              ))
            ) : (
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-md font-semibold italic">No skills added yet. Click the "+" icon to add skills.</div>
            )}
          </div>
        </section>

        {isOpenAbout && <About />}

        {/* Posts Section */}
        <section className="bg-white rounded-xl shadow p-6 sm:p-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
            <button onClick={() => setPostForm(true)} className="px-4 py-1.5 text-blue-600 border border-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition">+ Create Post</button>
          </div>

          {postForm && <CreatePost />}

          {myPosts.length > 0 ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <PostCard post={myPosts[0]} />
                {myPosts[1] && <PostCard post={myPosts[1]} />}
              </div>
              <div onClick={() => openPosts(authUser.user._id)} className="text-center text-blue-600 cursor-pointer hover:underline font-medium">Show All Posts <i className="fa-solid fa-arrow-right ml-1"></i></div>
            </div>
          ) : (
            <p className="text-gray-500 text-center italic">No posts yet.</p>
          )}
        </section>

        {/* Experience Section */}
        <section id="enhanceProfile" className="bg-white rounded-xl shadow p-6 sm:p-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
            <button onClick={updateEducation} className="p-2 rounded-full hover:bg-gray-100 transition" title="Edit Experience">
              <i className="fa-solid fa-briefcase text-gray-600"></i>
            </button>
          </div>

          <div className="space-y-6">
            {currUserProfile?.pastWork && currUserProfile.pastWork.length > 0 ? (
              currUserProfile.pastWork.map((work) => (
                <div key={work._id} className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800">{work.position}</h3>
                  <p className="text-sm text-gray-500">{work.years} Years</p>
                  <p className="mt-1 text-gray-700 font-medium">At {work.company}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No experience added yet.</p>
            )}
          </div>
        </section>

        {/* Education Section */}
        <section className="bg-white rounded-xl shadow p-6 sm:p-4 mt-6 mb-12">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-800">Education</h2>
            <button onClick={updateEducation} className="p-2 rounded-full hover:bg-gray-100 transition" title="Edit Education">
              <i className="fa-solid fa-graduation-cap text-gray-600"></i>
            </button>
          </div>

          <div className="space-y-6">
            {currUserProfile?.education && currUserProfile.education.length > 0 ? (
              currUserProfile.education.map((edu) => (
                edu && (
                  <div key={edu._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold text-gray-800">{edu.school}</h3>
                    <p className="text-sm text-gray-500">{edu.degree}</p>
                    <p className="mt-1 text-blue-600 text-sm">{edu.fieldOfStudy}</p>
                  </div>
                )
              ))
            ) : (
              <p className="text-gray-500 italic">No education details yet.</p>
            )}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="bg-white rounded-xl shadow p-6 sm:p-4 mt-6 mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            <i onClick={() => { setIsAchievementsOpen(true) }} className="fa-solid fa-plus text-lg p-2 rounded-full hover:bg-gray-50 cursor-pointer"></i>
          </div>
          {currUserProfile?.achievements && currUserProfile.achievements.length > 0 ? (
            <ul className="list-none space-y-3">
              {currUserProfile.achievements.map((ach, index) => (
                <li key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition">
                  <i className="fa-solid fa-award text-blue-600 text-lg"></i>
                  <span className="text-gray-700 font-medium">{ach}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className='text-gray-500 italic'>Add your achievements to showcase your accomplishments and skills. Click the "+" icon to get started!</div>
          )}
        </section>

        <SkillsModal isOpen={isSkillsOpen} setIsOpen={setIsSkillsOpen} existingSkills={currUserProfile?.skills || []} onSave={(skills) => console.log('Saved Skills:', skills)} />

        <AchievementsModal isOpen={isAchievementsOpen} setIsOpen={setIsAchievementsOpen} existingAchievements={currUserProfile?.achievements || []} onSave={(achievements) => console.log('Saved Achievements:', achievements)} />
      </div>

      {/* UpdateModel (global modal) */}
      {isOpen && (<UpdateModel />)}

      {/* Update Profile Picture Modal (responsive) */}
      {openProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          {isLoading && <Loading />}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 relative max-h-[90vh] overflow-auto">
            <button onClick={() => setOpenProfile(false)} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Update Your Profile Picture</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                <input type="file" name="profilePicture" accept="image/*" onChange={handleInputChange} />
                {imagePreview && (
                  <img src={imagePreview} referrerPolicy="no-referrer" alt="DP Preview" className="mt-2 w-24 h-24 rounded-full object-cover" />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpenProfile(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Cover Picture Modal (responsive) */}
      {openCover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          {isLoading && <Loading />}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 relative max-h-[90vh] overflow-auto">
            <button onClick={() => setOpenCover(false)} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Update Your Cover Picture</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cover Picture</label>
                <input type="file" name="coverPicture" accept="image/*" onChange={handleInputChange} />
                {coverPreview && (
                  <img src={coverPreview} referrerPolicy="no-referrer" alt="Cover Preview" className="mt-2 w-full max-w-[600px] h-36 rounded-lg object-cover" />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpenCover(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Education/Profile Form Modal */}
      {openUpdateEduForm && <UpdateProfile />}

    </div>
  )
}
