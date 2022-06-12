import { Container } from "@mui/material";
import ukraine from "../static/static-logo.jpg";

const HomePage = () => {
  return (
    <div className="page-wrapper">
      <Container
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "24px 0",
        }}
      >
        <h1
          style={{
            marginBottom: "15px",
            alignSelf: "center",
          }}
        >
          Gallery
        </h1>

        <img src={ukraine} alt="Stand with Ukraine"></img>
      </Container>
    </div>
  );
};

export { HomePage };
