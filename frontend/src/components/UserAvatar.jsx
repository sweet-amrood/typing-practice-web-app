import '../styles/frame-styles.css';

const SIZE_CLASS = {
  sm: 'avatar-frame--sm',
  md: 'avatar-frame--md',
  lg: 'avatar-frame--lg',
};

const UserAvatar = ({
  image,
  frameStyle = 'slate',
  alt = 'Profile photo',
  size = 'md',
  className = '',
}) => {
  const sizeClass = SIZE_CLASS[size] ?? SIZE_CLASS.md;
  const frameClass = `avatar-frame avatar-frame--${frameStyle} ${sizeClass}`;

  return (
    <div className={`${frameClass} ${className}`.trim()}>
      <span className="avatar-frame__shine" aria-hidden="true" />
      <span className="avatar-frame__corner avatar-frame__corner--tl" aria-hidden="true" />
      <span className="avatar-frame__corner avatar-frame__corner--tr" aria-hidden="true" />
      <span className="avatar-frame__corner avatar-frame__corner--bl" aria-hidden="true" />
      <span className="avatar-frame__corner avatar-frame__corner--br" aria-hidden="true" />
      <div className="avatar-frame__ring" aria-hidden="true" />
      <div className="avatar-frame__inner">
        {image ? (
          <img src={image} alt={alt} className="avatar-frame__img" />
        ) : (
          <span className="avatar-frame__fallback" aria-hidden="true">
            ?
          </span>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
