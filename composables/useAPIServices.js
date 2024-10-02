const { SERVER_URL } = useRuntimeConfig().public;

export const useAPIServices = () => {
  const fetchService = async (useFetchParams) => {
    const { data, error } = await useFetch(...useFetchParams);

    if (data.value) {
      return {
        success: true,
        data: data.value,
      };
    } else if (error.value) {
      console.error(error.value);
      return {
        success: false,
        error: error.value,
      };
    }
  };

  const createNewChallenge = async (newChallenge) => {
    return await fetchService([
      `${SERVER_URL}/challenge/new`,
      {
        method: "post",
        body: {
          newChallenge: newChallenge,
        },
      },
    ]);
  };

  return {
    createNewChallenge,
  };
};
