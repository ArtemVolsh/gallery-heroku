import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, Paper, Container, Typography, Stack } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

export const NewsItemPage = () => {
  const defaultNews = {};

  const location = useLocation();
  const params = useParams();

  console.log(location.pathname);

  const [newsItem, setNewsItem] = useState(defaultNews);

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
        url: `https://gallery-heroku.herokuapp.com/api/news/${params}`,
        withCredentials: true,
        data: {
          id: params,
        },
      })
        .then(({ data }) => {
          setNewsItem(data.data);
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
                  newsItem.approvalStatus
                }
              >
                {renderApprovalStatus(newsItem.approvalStatus)}
              </span>
              <div className="post-card__image-wrapper">
                <img className="post-card__image" src={newsItem.image} />
              </div>
              <Typography
                fullWidth
                fontWeight="bold"
                alignSelf="center"
                variant="h2"
                className="post-item__heading"
              >
                {newsItem.name}
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
                      Theme
                    </Typography>
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-author-value"
                    >
                      {newsItem.theme}
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
                      Author
                    </Typography>
                    <Typography
                      fullWidth
                      fontWeight="bold"
                      alignSelf="center"
                      variant="h5"
                      className="post-item__attribute attribute-date-value"
                    >
                      {newsItem.publishedBy}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Typography
                sx={{ marginInline: "auto", textAlign: "left", mt: 2, p: 2 }}
                variant="body1"
                fontSize="20px"
              >
                {newsItem.content}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};
