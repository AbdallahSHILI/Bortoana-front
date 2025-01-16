import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import share from '../../assests/images/settings/share.svg';
import video from '../../assests/images/settings/video-play_icon.svg';
import ReturnButton from '../../assests/images/settings/Return-Button.svg';
import personne from '../../assests/images/settings/Persone.svg';
import styles from './profileModal.module.css';
import EditProfileModal from '../EditProfileModal/editProfileModal';
import Cookies from 'js-cookie';

const ProfileModal = ({ closeModal, initialUserData, refreshUserData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localUserData, setLocalUserData] = useState({
        name: '',
        email: '',
        hasPassword: false,
        needsProfileSetup: false,
        textVideo: {},
        filter: '',
        hashtags: [],
        avatar: personne
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [associatedAccountsCount, setAssociatedAccountsCount] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return personne;
        if (avatarPath.startsWith('http')) return avatarPath;
        const normalizedPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
        return `http://localhost:5001${normalizedPath}`;
    };

    const fetchUserData = async () => {
        try {
            const userId = Cookies.get('userId');
            if (!userId) {
                throw new Error('No user ID found in cookies');
            }
    
            const response = await fetch(`http://localhost:5001/api/user/getuser/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('google_token')}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
    
            const data = await response.json();
            if (data.success) {
                setLocalUserData({
                    ...data.data,
                    avatar: getAvatarUrl(data.data.avatar)
                });
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message);
            setLocalUserData(prev => ({
                ...prev,
                avatar: personne
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStatusNumbers = async () => {
        try {
            const userId = Cookies.get('userId');
            if (!userId) {
                throw new Error('No user ID found in cookies');
            }

            const response = await fetch('http://localhost:5001/api/user/StatusNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch status numbers');
            }

            const result = await response.json();
            if (result.success) {
                setTotalPosts(result.data.total || 0);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.error('Error fetching status numbers:', err);
            setTotalPosts(0);
        }
    };

    const calculateAssociatedAccounts = () => {
        let count = 0;
        if (Cookies.get('linkedin_oauth_access_token')) count++;
        if (Cookies.get('twitter_oauth_token')) count++;
        setAssociatedAccountsCount(count);
    };

    useEffect(() => {
        fetchUserData();
        fetchStatusNumbers();
        calculateAssociatedAccounts();
    }, []);

    const handleImageError = (e) => {
        console.log('Image failed to load, falling back to default');
        e.target.src = personne;
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    if (isEditing) {
        return <EditProfileModal 
            closeModal={(wasUpdated) => {
                setIsEditing(false);
                if (wasUpdated) {
                    refreshUserData?.();
                    fetchUserData();
                }
            }} 
            isEditing={isEditing}
            userData={localUserData}
        />;
    }

    return (
        <div className={styles.modalContainer}>
            <div className={styles.leftSection}>
                <div className={styles.header}>
                    <img
                        src={ReturnButton}
                        alt="Return"
                        className={styles.icon}
                        onClick={closeModal}
                    />
                    <span>My Profile</span>
                </div>
                <div className={styles.profileContent}>
                    <div className={styles.profilePicture}>
                        <img 
                            crossOrigin="anonymous"
                            src={localUserData.avatar} 
                            alt="Profile" 
                            onError={handleImageError}
                        />
                        {localUserData.name && <div className={styles.userName}>{localUserData.name}</div>}
                    </div>

                    <button 
                        className={styles.editButton}
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>

                    <div className={styles.formContainer}>
                        <div className={styles.inputGroup}>
                            <label>User name</label>
                            <input
                                type="text"
                                placeholder={localUserData.name ? localUserData.name : "Not set"}
                                value={localUserData.name || ''}
                                readOnly
                            />
                            {!localUserData.name && (
                                <small className={styles.setupNote}>Please set up your username</small>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Email address</label>
                            <input
                                type="email"
                                placeholder={localUserData.email ? localUserData.email : "No email set"}
                                value={localUserData.email || ''}
                                readOnly
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={localUserData.hasPassword ? "********" : "No password set"}
                                readOnly
                            />
                            {localUserData.hasPassword && (
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.passwordToggle}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            )}
                            {!localUserData.hasPassword && (
                                <small className={styles.setupNote}>Please set up your password</small>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.statsCard}>
                    <h3>My social media accounts associated</h3>
                    <p>
                        <span className={styles.largeNumber}>{associatedAccountsCount}</span> accounts
                    </p>
                    <div className={styles.shareIconContainer}>
                        <img src={share} alt="Share" className={styles.shareIcon} />
                    </div>
                </div>

                <div className={styles.statsCard}>
                    <h3>Total Videos Created</h3>
                    <p>
                        <span className={styles.largeNumber}>{totalPosts}</span> Videos
                    </p>
                    <div className={styles.shareIconContainer}>
                        <img src={video} alt="Share" className={styles.shareIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;