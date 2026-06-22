import { useRef, useState } from 'react';
import { updateCosmetics, uploadCustomAvatar } from '../services/shopService';
import UserAvatar from './UserAvatar';

const SelectChip = ({ active, disabled, onClick, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`rounded-lg border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? 'border-theme-accent bg-theme-accent/15 text-theme-accent'
        : 'border-theme-border text-theme-muted hover:border-theme-accent/40'
    }`}
  >
    {children}
  </button>
);

const resizeImageFile = (file, maxSize = 256) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };

      img.onerror = () => reject(new Error('Could not read image'));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

const CosmeticsPicker = ({ cosmetics, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!cosmetics) return null;

  const equippedAvatar = cosmetics.avatars?.find((item) => item.equipped) ?? cosmetics.avatars?.[0];
  const equippedFrame = cosmetics.frames?.find((item) => item.equipped) ?? cosmetics.frames?.[0];

  const handleEquip = async (payload) => {
    setSaving(true);
    setError(null);

    try {
      await updateCosmetics(payload);
      await onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const imageData = await resizeImageFile(file);
      await uploadCustomAvatar(imageData);
      await onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-theme-border bg-theme-card/50 p-5">
      <h2 className="text-sm font-medium text-white">Avatar & frame</h2>
      <p className="mt-1 text-xs text-theme-muted">
        Pick a profile photo and frame. Upload your own photo, or unlock extra frames from levels, achievements, and the Shop.
      </p>

      <div className="mt-4 flex justify-center">
        <UserAvatar
          image={cosmetics.avatarImage ?? equippedAvatar?.image}
          frameStyle={equippedFrame?.style ?? 'slate'}
          size="lg"
        />
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-theme-muted">Photos</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cosmetics.avatars?.map((avatar) => (
            <SelectChip
              key={avatar.id}
              active={avatar.equipped}
              disabled={!avatar.owned || saving}
              onClick={() => handleEquip({ avatarId: avatar.id })}
            >
              <span className="avatar-picker-chip">
                {avatar.image && (
                  <img src={avatar.image} alt="" className="avatar-picker-thumb" />
                )}
                {avatar.label}
              </span>
            </SelectChip>
          ))}
          <SelectChip active={false} disabled={saving} onClick={() => fileInputRef.current?.click()}>
            Upload photo
          </SelectChip>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-theme-muted">Frames</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cosmetics.frames
            ?.filter((frame) => frame.owned)
            .map((frame) => (
              <SelectChip
                key={frame.id}
                active={frame.equipped}
                disabled={saving}
                onClick={() => handleEquip({ frameId: frame.id })}
              >
                <span className="avatar-picker-chip">
                  <UserAvatar
                    image={null}
                    frameStyle={frame.style ?? 'slate'}
                    size="sm"
                    className="frame-preview"
                  />
                  {frame.label}
                </span>
              </SelectChip>
            ))}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default CosmeticsPicker;
