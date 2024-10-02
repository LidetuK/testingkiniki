const useGlobalStore = defineStore("globalStore", () => {
  const user = ref(null);

  function setUser(user: Record<string, any>) {
    user.value = user;
  }

  return { user, setUser };
});

export default useGlobalStore;
