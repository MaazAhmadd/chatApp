let localmaxuser = 0;
let maxusers = 0;
const getmaxusers = () => {
  return maxusers;
};
const getlocalmaxuser = () => {
  return localmaxuser;
};
const incrementlocal = () => {
  localmaxuser++;
};
const setmaxusers = (v) => {
  maxusers = v;
};
const setlocalusers = (v) => {
  localmaxuser = v;
};
module.exports = {
  getmaxusers,
  setmaxusers,
  incrementlocal,
  getlocalmaxuser,
  setlocalusers,
};
