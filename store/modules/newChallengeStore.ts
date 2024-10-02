const useNewChallengeStore = defineStore("newChallenge", () => {
  const challengeCheckoutState = ref({});
  const challengeAccountState = ref({});

  function setChallengeCheckout(checkoutUser: Record<string, any>) {
    challengeCheckoutState.value = checkoutUser;
  }

  function setChallengeAccount(accountUser: Record<string, any>) {
    challengeAccountState.value = accountUser;
  }

  return {
    challengeCheckoutState,
    setChallengeCheckout,
    challengeAccountState,
    setChallengeAccount,
  };
});

export default useNewChallengeStore;
