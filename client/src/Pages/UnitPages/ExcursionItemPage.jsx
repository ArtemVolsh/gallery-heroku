import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, Paper, Container, Typography, Stack } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

export const ExcursionsItemPage = () => {
  const defaultExcursion = {};

  const location = useLocation();
  const params = useParams();

  console.log(location.pathname);

  const [excursion, setExcursion] = useState(defaultExcursion);

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
        url: `https://gallery-heroku.herokuapp.com /api/excursions/${params}`,
        withCredentials: true,
        data: {
          id: params,
        },
      })
        .then(({ data }) => {
          setExcursion(data.data);
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
                  excursion.approvalStatus
                }
              >
                {renderApprovalStatus(excursion.approvalStatus)}
              </span>
              <div className="post-card__image-wrapper">
                <img className="post-card__image" src={excursion.image} />
              </div>
              <Typography
                fullWidth
                fontWeight="bold"
                alignSelf="center"
                variant="h2"
                className="post-item__heading"
              >
                {excursion.name}
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignSelf="center">
                  <Stack direction="row" flexWrap="true">
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-author"
                    >
                      Author
                    </Typography>
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-author-value"
                    >
                      {excursion.offeredBy}
                    </Typography>
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
                      ₴ {excursion.price}
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
                      Date
                    </Typography>
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-date-value"
                    >
                      {new Date(excursion.date).toLocaleString(
                        "uk-UK",
                        timeLocalOptions
                      )}
                    </Typography>
                  </Stack>
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
                      {excursion.place}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Typography
                sx={{ marginInline: "auto", textAlign: "left", mt: 2, p: 2 }}
                variant="body1"
                fontSize="20px"
              >
                {excursion.content}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};
