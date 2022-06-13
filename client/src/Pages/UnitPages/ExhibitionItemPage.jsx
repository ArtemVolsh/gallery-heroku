import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, Paper, Container, Typography, Stack } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

export const ExhibitionItemPage = () => {
  const defaultExhibition = {};

  const location = useLocation();
  const params = useParams();

  console.log(location.pathname);

  const [exhibition, setExhibition] = useState(defaultExhibition);

  const timeLocalOptions = {
    weekday: "short",
    year: "2-digit",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: undefined,
  };

  useEffect(() => {
    const fetchData = () => {
      let query;
      axios({
        method: "POST",
        url: `https://gallery-heroku.herokuapp.com /api/exhibitions/${params}`,
        withCredentials: true,
        data: {
          id: params,
        },
      })
        .then(({ data }) => {
          setExhibition(data.data);
        })
        .catch((e) => console.log(e));
    };

    fetchData();
  }, [params]);

  const renderApprovalStatus = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Accepted";
      case 2:
        return "Rejected";
    }
  };

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
        <Grid>
          <Paper className="post-item">
            <Stack>
              <span
                className={
                  "post-card__status post-card__status-color-" +
                  exhibition.approvalStatus
                }
              >
                {renderApprovalStatus(exhibition.approvalStatus)}
              </span>
              <div className="post-card__image-wrapper">
                <img className="post-card__image" src={exhibition.image} />
              </div>
              <Typography
                fullWidth
                fontWeight="bold"
                alignSelf="center"
                variant="h2"
                className="post-item__heading"
              >
                {exhibition.name}
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignSelf="center">
                  <Stack direction="row" flexWrap="true">
                    <Stack direction="row">
                      <Typography
                        fullWidth
                        fontWeight="bold"
                        alignSelf="center"
                        variant="h5"
                        className="post-item__attribute attribute-place"
                      >
                        Place
                      </Typography>
                      <Typography
                        fullWidth
                        fontWeight="bold"
                        alignSelf="center"
                        variant="h5"
                        className="post-item__attribute attribute-place-value"
                      >
                        {exhibition.place}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-price"
                    >
                      Price
                    </Typography>
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-price-value"
                    >
                      {exhibition.price === 0
                        ? "Free"
                        : "₴ " + exhibition.price}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={2} alignSelf="center">
                  <Stack direction="row" flexWrap="true">
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-date"
                    >
                      Start Date
                    </Typography>
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-date-value"
                    >
                      {new Date(exhibition.date).toLocaleString(
                        "uk-UK",
                        timeLocalOptions
                      )}
                    </Typography>
                  </Stack>
                  <Stack direction="row" flexWrap="true">
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-author"
                    >
                      End Date
                    </Typography>
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-author-value"
                    >
                      {new Date(exhibition.endDate).toLocaleString(
                        "uk-UK",
                        timeLocalOptions
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Typography
                sx={{ marginInline: "auto", textAlign: "left", mt: 2, p: 2 }}
                variant="body1"
                fontSize="20px"
              >
                {exhibition.content}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};
