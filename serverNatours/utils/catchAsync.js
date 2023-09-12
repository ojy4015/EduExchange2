///////////////////////////////////////////////////////

export default fn => {
  return (req, res, next) => {
    // console.log("req in fn => ", req);
    fn(req, res, next).catch(next);
  };
};
