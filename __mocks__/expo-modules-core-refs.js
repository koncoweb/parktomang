// Mock untuk expo-modules-core/build/Refs
module.exports = {
  createSnapshotFriendlyRef: () => {
    // We cannot use `createRef` since it is not extensible.
    const ref = { current: null };
    Object.defineProperty(ref, 'toJSON', {
      value: () => '[React.ref]',
    });
    return ref;
  },
};

