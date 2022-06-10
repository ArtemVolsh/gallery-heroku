import { useEffect, useState } from "react";
import { Container, Grid, Paper } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useLocation } from "react-router-dom";

const ExhibitionsPage = () => {
  const [filter, setFilter] = useState("");
  const [exhibitions, setExhibitions] = useState([]);

  const location = useLocation();
  const params = location.search ? location.search : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    let cancel;

    const fetchData = async () => {
      try {
        let query;

        if (params && !filter) query = params;
        else query = filter;

        axios({
          method: "GET",
          url: `https://gallery-heroku.herokuapp.com/api/exhibitions${query}`,
          withCredentials: true,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })
          .then((response) => {
            setExhibitions(response.data.data);
          })
          .catch((e) => console.log(e));
      } catch (e) {
        console.log(e);
        console.log(e?.response?.data);
      }
    };

    fetchData();

    return () => cancel();
  }, [filter, params]);

  return (
    <>
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
          <h1 style={{ marginBottom: "15px" }}>Exhibitions Page</h1>
          <Grid container spacing={2}>
            {exhibitions.map((exhs) => (
              <Grid key={`grid-${exhs._id}`} item lg={3} md={4} xs={2}>
                <Paper className="post-card">
                  <div className="post-card__image-wrapper">
                    <img className="post-card__image" src={exhs.image} alt="" />
                  </div>
                  <div style={{ padding: "10px" }}>
                    <h2 style={{ paddingBottom: "10px" }}>{exhs.name}</h2>
                    <span className="post-card__subheading">Theme</span>
                    <span style={{ marginLeft: "5px" }}>{exhs.theme}</span>
                    <br />
                    <span className="post-card__subheading">Price</span>
                    <span style={{ marginLeft: "5px" }}>{exhs.price}₴</span>
                    <br />
                    <span className="post-card__subheading">Place</span>
                    <span style={{ marginLeft: "5px" }}>{exhs.place}</span>
                    <br />
                    <span className="post-card__subheading">Start Date</span>
                    <span style={{ marginLeft: "5px" }}>
                      {new Date(exhs.date).toLocaleString(
                        "uk-UK",
                        timeLocalOptions
                      )}
                    </span>
                    <br />
                    <span className="post-card__subheading">End Date</span>
                    <span style={{ marginLeft: "5px" }}>
                      {new Date(exhs.endDate).toLocaleString(
                        "uk-UK",
                        timeLocalOptions
                      )}
                    </span>

                    <p style={{ paddingBottom: "5px" }}>
                      <i>{exhs.content}</i>
                    </p>
                    <span>Comments:</span>
                    <div className="comment-section">
                      {exhs.feedback.map((feedbackItem) => (
                        <>
                          <div key={feedbackItem._id}>
                            {feedbackItem.content}
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export { ExhibitionsPage };
