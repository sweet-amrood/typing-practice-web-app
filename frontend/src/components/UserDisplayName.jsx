const UserDisplayName = ({
  name,
  badgeEmoji = null,
  title = null,
  className = '',
  nameClassName = 'user-display-name__name',
  titleClassName = 'user-display-name__title',
  as: Tag = 'div',
  hideDefaultTitle = true,
  ...rest
}) => {
  const showTitle = title && !(hideDefaultTitle && title === 'Novice');

  return (
    <Tag className={`user-display-name ${className}`.trim()} {...rest}>
      <span className="user-display-name__row">
        {badgeEmoji && (
          <span className="user-display-name__badge" aria-hidden="true" title="Equipped badge">
            {badgeEmoji}
          </span>
        )}
        <span className={nameClassName}>{name}</span>
      </span>
      {showTitle && <span className={titleClassName}>{title}</span>}
    </Tag>
  );
};

export default UserDisplayName;
