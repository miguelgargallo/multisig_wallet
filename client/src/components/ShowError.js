import Typography from "@mui/material/Typography";
const ShowError = ({ flag, error }) => {
  return (
    <>{flag ? <Typography color="red">{error?.message}</Typography> : <></>}</>
  );
};

export default ShowError;
