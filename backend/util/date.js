const formatDate = (date) => {
  const yyyy = `${date.getFullYear()}`;
  const mm = `${+date.getMonth() <= 9 ? "0" : ""}${date.getMonth() + 1}`;
  const dd = `${+date.getDate() <= 9 ? "0" : ""}${date.getDate() + 1}`;
  return `${yyyy}-${mm}-${dd}`;
};

console.log(
  formatDate(
    new Date(`${new Date().getFullYear() + 1}-${new Date().getMonth() + 1}`)
  )
);
module.exports = { formatDate };
