import challengesListData from "~/data/challengesListData.js";

const useChallengeCardStore = defineStore("challengeList", () => {
  const challengesListState = ref(challengesListData);
  const activeChallengeState = ref(challengesListData[0]);

  function setActiveChallenge(challengeIndex) {
    activeChallengeState.value = challengesListData[challengeIndex];
  }

  return {
    challengesListState,
    activeChallengeState,
    setActiveChallenge,
  };
});

export default useChallengeCardStore;
