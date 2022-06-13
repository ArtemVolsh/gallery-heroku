import * as React from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Stack,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Done, Close, List, ExpandMore } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  updateApprovalNews,
  updateApprovalExhibitions,
  updateApprovalExcursions,
} from "../../apiRequests/apiRequests";
import PropTypes from "prop-types";
import { v4 } from "uuid";
const { log } = console;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

let totalRender = 0;

export const queryTypes = {
  requested: "?approvalStatus[eq]=0",
  approved: "?approvalStatus[eq]=1",
  rejected: "?approvalStatus[eq]=2",
};

export const RequestedPosts = () => {
  const location = useLocation();
  const params = location.search ? location.search : null;

  const [filter, setFilter] = useState("");
  const [poke, setPoke] = useState(false);

  // 0 -> requested, 1 -> approved, 2 -> rejected
  const [tabValue, setTabValue] = useState(0);

  // Post states (not an whole object to remove complicated state calls)
  const [reqNews, setReqNews] = useState([]);
  const [reqExhs, setReqExhs] = useState([]);
  const [reqExcs, setReqExcs] = useState([]);

  const [appNews, setAppNews] = useState([]);
  const [appExcs, setAppExcs] = useState([]);
  const [appExhs, setAppExhs] = useState([]);

  const [rejNews, setRejNews] = useState([]);
  const [rejExcs, setRejExcs] = useState([]);
  const [rejExhs, setRejExhs] = useState([]);

  const handleTabChange = (e, nextValue) => {
    setTabValue(nextValue);
  };

  const updateNews = async (query) => {
    return new axios({
      method: "GET",
      url: `https://gallery-heroku.herokuapp.com /api/news${query}`,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(({ data }) => {
      switch (tabValue) {
        case 0:
          setReqNews(data.data);
          break;
        case 1:
          setAppNews(data.data);
          break;
        case 2:
          setRejNews(data.data);
          break;
      }
    });
  };

  const updateExcursions = async (query) => {
    return new axios({
      method: "GET",
      url: `https://gallery-heroku.herokuapp.com /api/excursions${query}`,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(({ data }) => {
      switch (tabValue) {
        case 0:
          setReqExcs(data.data);
          break;
        case 1:
          setAppExcs(data.data);
          break;
        case 2:
          setRejExcs(data.data);
          break;
      }
    });
  };

  const updateExhibitions = async (query) => {
    return new axios({
      method: "GET",
      url: `https://gallery-heroku.herokuapp.com /api/exhibitions${query}`,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(({ data }) => {
      switch (tabValue) {
        case 0:
          setReqExhs(data.data);
          break;
        case 1:
          setAppExhs(data.data);
          break;
        case 2:
          setRejExhs(data.data);
          break;
      }
    });
  };

  // send query as parameter
  const fetchData = async (query) => {
    try {
      await updateNews(query);
      await updateExhibitions(query);
      await updateExcursions(query);
    } catch (e) {
      console.log(e);
      console.log(e?.response?.data);
    }
  };

  useEffect(() => {
    totalRender += 1;
    console.log("Total renders: " + totalRender);
  });

  useEffect(() => {
    switch (tabValue) {
      case 0:
        return fetchData(queryTypes.requested);
      case 1:
        return fetchData(queryTypes.approved);
      case 2:
        return fetchData(queryTypes.rejected);
    }
  }, [filter, params, poke, tabValue]);

  return (
    <div className="page-wrapper">
      <Container
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "24px 0",
          maxWidth: 1200,
          overflow: "hidden",
        }}
      >
        <Button variant="outlined" onClick={() => setPoke(!poke)}>
          Poke
        </Button>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Requested Posts" />
          <Tab label="Approved Posts" />
          <Tab label="Rejected Posts" />
        </Tabs>

        {/* REQUESTED POSTS TAB */}
        <TabPanel value={tabValue} index={0}>
          <Typography marginBottom={2} fontWeight="bold" variant="h4">
            Requested Posts ({reqNews.length + reqExcs.length + reqExhs.length})
          </Typography>

          {/* EXCURSIONS */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                sx={{ minWidth: "50%" }}
                marginBottom={1}
                className="requested-heading"
                variant="h5"
              >
                Excursions to review: {reqExcs.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {reqExcs.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div
                        className="post-card__data-wrapper"
                        style={{ padding: "10px" }}
                      >
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalExcursions(rp._id, 1);
                              updateExcursions(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="success"
                            variant="contained"
                          >
                            <Done />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              updateApprovalExcursions(rp._id, 2);
                              updateExcursions(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="error"
                            variant="contained"
                          >
                            <Close />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/excursions/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* EXHIBITIONS */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                sx={{ minWidth: "50%" }}
                marginBottom={1}
                className="requested-heading"
                variant="h5"
              >
                Exhibitions to review: {reqExhs.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {reqExhs.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div className="post-card__data-wrapper">
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalExhibitions(rp._id, 1);
                              updateExhibitions(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="success"
                            variant="contained"
                          >
                            <Done />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              updateApprovalExhibitions(rp._id, 2);
                              updateExhibitions(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="error"
                            variant="contained"
                          >
                            <Close />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/exhibitions/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* NEWS */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                marginBottom={1}
                sx={{ minWidth: "50%" }}
                className="requested-heading"
                variant="h5"
              >
                News to review: {reqNews.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {reqNews.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div className="post-card__data-wrapper">
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <br />
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalNews(rp._id, 1);
                              updateNews(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="success"
                            variant="contained"
                          >
                            <Done />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              updateApprovalNews(rp._id, 2);
                              updateNews(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="error"
                            variant="contained"
                          >
                            <Close />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/news/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* APPROVED POSTS TAB */}
        <TabPanel value={tabValue} index={1}>
          <Typography marginBottom={2} fontWeight="bold" variant="h4">
            Approved Posts ({appNews.length + appExcs.length + appExhs.length})
          </Typography>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                sx={{ minWidth: "50%" }}
                marginBottom={1}
                className="approved-heading"
                variant="h5"
              >
                Approved excursions: {appExcs.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {appExcs.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div
                        className="post-card__data-wrapper"
                        style={{ padding: "10px" }}
                      >
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalExcursions(rp._id, 2);
                              updateExcursions(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="error"
                            variant="contained"
                          >
                            <Close />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/excursions/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                sx={{ minWidth: "50%" }}
                marginBottom={1}
                className="approved-heading"
                variant="h5"
              >
                Approved exhibitions: {appExhs.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {appExhs.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div className="post-card__data-wrapper">
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalExhibitions(rp._id, 2);
                              updateExhibitions(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="error"
                            variant="contained"
                          >
                            <Close />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/exhibitions/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                marginBottom={1}
                sx={{ minWidth: "50%" }}
                className="approved-heading"
                variant="h5"
              >
                Approved news: {appNews.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {appNews.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div className="post-card__data-wrapper">
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalNews(rp._id, 2);
                              updateNews(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="error"
                            variant="contained"
                          >
                            <Close />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/news/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* REJECTED POSTS TAB */}
        <TabPanel value={tabValue} index={2}>
          <Typography marginBottom={2} fontWeight="bold" variant="h4">
            Rejected Posts ({rejNews.length + rejExcs.length + rejExhs.length})
          </Typography>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                sx={{ minWidth: "50%" }}
                marginBottom={1}
                className="rejected-heading"
                variant="h5"
              >
                Rejected excursions: {rejExcs.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {rejExcs.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div
                        className="post-card__data-wrapper"
                        style={{ padding: "10px" }}
                      >
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalExcursions(rp._id, 1);
                              updateExcursions(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="success"
                            variant="contained"
                          >
                            <Done />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/excursions/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                sx={{ minWidth: "50%" }}
                marginBottom={1}
                className="rejected-heading"
                variant="h5"
              >
                Rejected exhibitions: {rejExhs.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {rejExhs.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div className="post-card__data-wrapper">
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalExhibitions(rp._id, 1);
                              updateExhibitions(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="success"
                            variant="contained"
                          >
                            <Done />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/exhibitions/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore color="primary" fontSize="large" />}
            >
              <Typography
                marginBottom={1}
                sx={{ minWidth: "50%" }}
                className="rejected-heading"
                variant="h5"
              >
                Rejected news: {rejNews.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid className="grid-container">
                {rejNews.map((rp) => (
                  <Grid className="grid-item" item key={v4()}>
                    <Paper className="post-card">
                      <div className="post-card__image-wrapper">
                        <img
                          className="post-card__image"
                          src={rp.image}
                          alt=""
                        />
                      </div>
                      <div className="post-card__data-wrapper">
                        <Typography
                          fontSize="1.125rem"
                          fontWeight="bold"
                          lineHeight="110%"
                          className="text-overflow"
                          style={{ marginBottom: "10px" }}
                        >
                          {rp.name}
                        </Typography>
                        <div>
                          <span className="post-card__subheading">Theme</span>
                          <span
                            style={{
                              marginLeft: "5px",
                              display: "inline-block",
                            }}
                          >
                            {rp.theme}
                          </span>
                        </div>
                        <span className="post-card__subheading">
                          Published by
                        </span>
                        <span style={{ marginLeft: "5px" }}>{}</span>
                        <Box className="post-card__content-wrapper">
                          <Typography
                            className="text-overflow post-card__content"
                            paragraph
                            variant="body2"
                          >
                            {rp.content}
                          </Typography>
                        </Box>
                        <Stack
                          className="post-card__controls"
                          direction="row"
                          spacing={1}
                        >
                          <IconButton
                            onClick={() => {
                              updateApprovalNews(rp._id, 1);
                              updateNews(queryTypes.requested);
                              setPoke(!poke);
                            }}
                            color="success"
                            variant="contained"
                          >
                            <Done />
                          </IconButton>
                          <Button variant="outlined" startIcon={<List />}>
                            <Link
                              style={{
                                textDecoration: "none",
                                "&:visited": {
                                  color: "inherit",
                                },
                              }}
                              to={"/news/" + rp._id}
                            >
                              Details
                            </Link>
                          </Button>
                        </Stack>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </TabPanel>
      </Container>
    </div>
  );
};
