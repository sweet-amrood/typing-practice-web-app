export const getEquippedCosmeticsView = (cosmetics) => {
  if (!cosmetics) return null;

  const frame = cosmetics.frames?.find((item) => item.equipped);

  return {
    avatarImage: cosmetics.avatarImage,
    frameStyle: frame?.style ?? 'slate',
  };
};
