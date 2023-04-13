const numberOfKeys = (obj: Record<any, any>) => {
  if (!obj) return 0;
  return Object.keys(obj).length;
};

export default numberOfKeys;
