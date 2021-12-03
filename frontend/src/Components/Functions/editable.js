


const editableTabSwotAndRor = (rights, pendingData1, rejectedData1, pendingData2, rejectedData2) => {
  if (rights == 1 || rights == 3) {
    if (pendingData1 || rejectedData1 || pendingData2 || rejectedData2) {
      return false
    }
    else {
      return true
    }
  }
  else {
    return false
  }
}

const editableTab = (rights, pendingData, rejectedData) => {
  if (rights == 1 || rights == 3) {
    if (pendingData || rejectedData) {
      return false
    }
    else {
      return true
    }
  }
  else {
    return false
  }
}

const editableOrgChart = (rights) => {
  return (rights == 1);
}

const editableRolesAndRes = (rights, priv_id) => {
  return (rights == 1 || priv_id == 2);
}

export default {
  editableTabSwotAndRor,
  editableTab,
  editableOrgChart,
  editableRolesAndRes
}