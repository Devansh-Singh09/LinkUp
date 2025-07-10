import React from 'react';
import { LANGUAGE_TO_FLAG } from '../constants';
import { Link } from 'react-router'; // ✅ FIXED

const FriendCard = ({ friend }) => {
  if (!friend) return null; // ✅ Defensive guard

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 rounded-full overflow-hidden">
            <img
              src={friend.profilePicture || '/default-avatar.png'} // ✅ Fallback
              alt={friend.fullname || 'User'}
            />
          </div>
          <h3 className="font-semibold truncate">{friend.fullname || 'Unnamed'}</h3>
        </div>

        {/* LANGUAGES */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {capitalize(friend.nativeLanguage)}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {capitalize(friend.learningLanguage)}
          </span>
        </div>

        {/* MESSAGE BUTTON */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

// ✅ Flag utility
export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }

  return null;
}

// ✅ Capitalize fallback
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
