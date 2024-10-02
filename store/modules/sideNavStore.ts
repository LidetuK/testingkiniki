import sideNavListData from "~/data/sideNavListData";

const useSideNavStore = defineStore("sideNav", () => {
  const sideNavListState = ref(sideNavListData);
  const activeSideNavIdState = ref(sideNavListData[1].id);

  function setSideNavId(sideNavId) {
    activeSideNavIdState.value = sideNavId;
  }

  return {
    sideNavListState,
    activeSideNavIdState,
    setSideNavId,
  };
});

export default useSideNavStore;
