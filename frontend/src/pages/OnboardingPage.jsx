  import React, { useState } from 'react';
  import useAuthUser from '../hooks/useAuthUser';
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import toast from 'react-hot-toast';
  import { completeOnboarding } from '../lib/api';
  import {
    Camera,
    MapPinIcon,
    ShipWheelIcon,
    Shuffle,
    LoaderCircle,
  } from 'lucide-react';
  import { LANGUAGES } from '../constants';

  const OnboardingPage = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const [formState, setFormState] = useState({
      fullname: authUser?.fullname || '',
      bio: authUser?.bio || '',
      nativeLanguage: authUser?.nativeLanguage || '',
      learningLanguage: authUser?.learningLanguage || '',
      location: authUser?.location || '',
      profilePic: authUser?.profilePic || '',
    });

    const { mutate: onboardingMutation, isPending } = useMutation({
      mutationFn: completeOnboarding,
      onSuccess: () => {
        toast.success('Profile onboarded successfully');
        queryClient.invalidateQueries({ queryKey: ['authUser'] });
      },
      onError: (error) => {
        console.error('❌ Error during onboarding:', error);
        toast.error(error.response?.data?.message || 'Something went wrong');
      },
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      try {
        onboardingMutation(formState);
      } catch (err) {
        console.error('❌ Unexpected error:', err);
      }
    };

    const handleRandomAvatar = () => {
      const idx = Math.floor(Math.random() * 100) + 1;
      const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

      const img = new Image();
      img.src = randomAvatar;
      img.onload = () => {
        setFormState({ ...formState, profilePic: randomAvatar });
        toast.success('Random profile picture generated!');
      };
      img.onerror = () => {
        toast.error('Failed to load avatar. Try again.');
      };
    };

    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              Complete Your Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Preview */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                      onError={() =>
                        setFormState({ ...formState, profilePic: '' })
                      }
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Camera className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-accent"
                  >
                    <Shuffle className="size-4 mr-2" />
                    Generate Random Avatar
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formState.fullname}
                  onChange={(e) =>
                    setFormState({ ...formState, fullname: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
              </div>

              {/* Bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({ ...formState, bio: e.target.value })
                  }
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>

              {/* Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                    className="input input-bordered w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                className="btn btn-primary w-full"
                disabled={isPending}
                type="submit"
              >
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LoaderCircle className="animate-spin size-5 mr-2" />
                    Onboarding...
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default OnboardingPage;
