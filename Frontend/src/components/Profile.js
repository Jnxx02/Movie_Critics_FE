import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        user_id: "",
        name: "",
        email: "",
        role: "",
        bio: "",
        password: "",
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        const token = localStorage.getItem('access_token');
        fetch('http://127.0.0.1:8000/users/user-profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched profile data:', data);
            if (data.user_id) {
                setProfile({ ...data, password: "" });
            } else {
                console.error('Invalid profile data:', data);
            }
        })
        .catch(error => console.error('Error fetching profile:', error));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const profileData = {
            name: profile.name,
            email: profile.email,
            role: profile.role,
            bio: profile.bio,
            password: profile.password || undefined,
        };
        console.log('Profile data to be submitted:', profileData);
        fetch(`http://127.0.0.1:8000/users/${profile.user_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        })
        .then(response => {
            if (response.ok) {
                fetchProfile();
                handleEditToggle();
            } else {
                return response.json().then(data => {
                    console.error('Error details:', data);
                    throw new Error(JSON.stringify(data));
                });
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert(`Error updating profile: ${error.message}`);
        });
    };

    return (
        <div className="profile-container">
            <div className="top-card">
                <h1>Profile</h1>
                <button type="button" className="btn btn-edit-profile" onClick={handleEditToggle}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="profile-card">
                <img
                    src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?size=626&amp;ext=jpg&amp;ga=GA1.1.2043474510.1718615911&amp;semt=ais_user"
                    alt="Profile"
                    className="profile-img"
                />
                {isEditing ? (
                    <form className="profile-info-edit" onSubmit={handleSubmit}>
                        <p>Nama</p>
                        <input type="text" name="name" value={profile.name} onChange={handleChange} />
                        <p>Email</p>
                        <input type="email" name="email" value={profile.email} onChange={handleChange} />
                        <p>Bio</p>
                        <input type="text" name="bio" value={profile.bio} onChange={handleChange} />
                        <p>Password</p>
                        <input type="password" name="password" value={profile.password} onChange={handleChange} placeholder="Enter new password" />
                        <button type="submit" className='btn-save'>Save Changes</button>
                    </form>
                ) : (
                    <div className="profile-info">
                        <div className='profile-info-detail'>
                            <p className="profile-label">Nama</p>
                            <p className="profile-value">{profile.name}</p>
                        </div>

                        <div className='profile-info-detail'>
                            <p className="profile-label">Email</p>
                            <p className="profile-value">{profile.email}</p>
                        </div>

                        <div className='profile-info-detail'>
                            <p className="profile-label">Role</p>
                            <p className="profile-value">{profile.role}</p>
                        </div>

                        <div className='profile-info-detail'>
                            <p className="profile-label">Bio</p>
                            <p className="profile-value">{profile.bio}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
