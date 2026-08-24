import { useEffect, useState } from 'react';
import { profileApi } from '../api/profile.js';
import { useFetch } from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export default function Profile() {
  const { updateUser } = useAuth();
  const { data, isLoading, error, refetch, setData } = useFetch(profileApi.get, []);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.profile) {
      setForm({
        name: data.profile.name,
        bio: data.profile.bio || '',
        program: data.profile.program || '',
        year: data.profile.year || '',
        location: data.profile.location || '',
        interests: (data.profile.interests || []).join(', '),
        learningGoals: data.profile.learningGoals || '',
      });
    }
  }, [data]);

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  if (isLoading || !form) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const { profile } = data;
  const initials = profile.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Name cannot be empty.' });
      return;
    }
    setServerError('');
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        bio: form.bio,
        program: form.program,
        year: form.year,
        location: form.location,
        learningGoals: form.learningGoals,
        interests: form.interests
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const { profile: updated } = await profileApi.update(payload);
      setData((prev) => ({ ...prev, profile: { ...prev.profile, ...updated } }));
      updateUser({ name: updated.name });
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setServerError(err.message || 'Unable to save changes.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-ink">Profile</h1>
        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {saved && (
        <p className="rounded-DEFAULT bg-success-light px-3.5 py-2.5 text-sm text-success animate-fadeSlideUp">
          Your profile has been updated.
        </p>
      )}

      <Card className="p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-semibold text-white">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold text-ink">{profile.name}</h2>
            <p className="text-sm text-ink-soft">{profile.email}</p>
            <p className="mt-1 text-sm text-ink-faint">
              {profile.program} {profile.program && profile.year ? '·' : ''} {profile.year}
            </p>
            <p className="text-sm text-ink-faint">{profile.location}</p>
          </div>
          <div className="ml-auto flex shrink-0 flex-col items-center rounded-lg bg-paper px-5 py-3 text-center">
            <span className="text-xl font-semibold text-ink">{profile.completedCourses}</span>
            <span className="text-xs text-ink-soft">Completed Courses</span>
          </div>
        </div>
      </Card>

      {!isEditing ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-faint">Bio</h3>
            <p className="text-sm leading-relaxed text-ink-soft">{profile.bio || 'No bio added yet.'}</p>
          </Card>
          <Card className="p-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-faint">Learning Goals</h3>
            <p className="text-sm leading-relaxed text-ink-soft">{profile.learningGoals || 'No learning goals added yet.'}</p>
          </Card>
          <Card className="p-6 lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-faint">Interests</h3>
            {profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span key={interest} className="badge-accent">
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-soft">No interests added yet.</p>
            )}
          </Card>
        </div>
      ) : (
        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input id="name" name="name" label="Full Name" value={form.name} onChange={handleChange} error={errors.name} />
              <Input id="program" name="program" label="Program" value={form.program} onChange={handleChange} />
              <Input id="year" name="year" label="Year" value={form.year} onChange={handleChange} />
              <Input id="location" name="location" label="Location" value={form.location} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="bio" className="label">
                Bio
              </label>
              <textarea id="bio" name="bio" rows={3} value={form.bio} onChange={handleChange} className="input resize-none" />
            </div>

            <div>
              <label htmlFor="learningGoals" className="label">
                Learning Goals
              </label>
              <textarea
                id="learningGoals"
                name="learningGoals"
                rows={2}
                value={form.learningGoals}
                onChange={handleChange}
                className="input resize-none"
              />
            </div>

            <Input
              id="interests"
              name="interests"
              label="Interests"
              hint="Separate interests with commas."
              value={form.interests}
              onChange={handleChange}
            />

            {serverError && (
              <p role="alert" className="rounded-DEFAULT bg-danger-light px-3.5 py-2.5 text-sm text-danger">
                {serverError}
              </p>
            )}

            <div className="flex gap-3">
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
