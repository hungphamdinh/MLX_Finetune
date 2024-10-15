import useApp from './App/Hooks/UseApp';

const useFeatureFlag = () => {
  const {
    app: {
      allSettings: { general },
    },
  } = useApp();
  const isEnableLiveThere = general?.isEnableLiveThere;
  return {
    isEnableLiveThere,
  };
};

export default useFeatureFlag;
