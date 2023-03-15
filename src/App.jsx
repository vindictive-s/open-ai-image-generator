import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CardActionArea,
  CardContent,
  CardActions,
  Card,
  Stack,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Image from "mui-image";
import { Configuration, OpenAIApi } from "openai";
import { saveAs } from "file-saver";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search for ...");

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPEN_AI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setPlaceholder(`Search ${prompt}...`);
    setIsLoading(true);
    try {
      const response = await openai.createImage({
        prompt: prompt,
        n: 2,
        size: "512x512",
      });
      setIsLoading(false);
      setResult(response.data.data[0].url);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  const handleClick = () => {
    let url = result;
    saveAs(url, "image-generated");
  };

  return (
    <Box className="app" bgcolor="#fefefe">
      {isLoading ? (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          paddingTop={8}
        >
          <Typography variant="h4" color="#1a0829">
            Generating... Please wait...
          </Typography>
        </Stack>
      ) : (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          paddingTop={8}
        >
          <Typography variant="h4" color="#1a0829">
            Generate Images using Open AI Api
          </Typography>
          <TextField
            id="outlined-basic"
            label="Insert prompt"
            variant="outlined"
            placeholder={placeholder}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            multiline={true}
            sx={{
              width: "500px",
            }}
          />
          <Button
            variant="contained"
            onClick={generateImage}
            disableElevation
            startIcon={<KeyboardArrowRightIcon />}
            sx={{
              backgroundColor: "#e3c2ff",
              color: "#1a0829",
              "&:hover": { backgroundColor: "#bfdcff" },
            }}
          >
            Generate Image
          </Button>
          {result.length > 0 ? (
            <Card
              sx={{ maxWidth: 512 }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CardActionArea>
                <Image
                  src={result}
                  alt="image-generated"
                  showLoading
                  style={{ boxShadow: "none !important" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {prompt}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                sx={{
                  justifyContent: "space-between",
                  backgroundColor: "#e5e5e5",
                }}
              >
                <Button
                  onClick={handleClick}
                  variant="contained"
                  disableElevation
                  startIcon={<KeyboardArrowRightIcon />}
                  sx={{
                    backgroundColor: "#e3c2ff",
                    color: "#1a0829",
                    "&:hover": { backgroundColor: "#bfdcff" },
                  }}
                >
                  Download Image
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<KeyboardArrowRightIcon />}
                  sx={{
                    backgroundColor: "#e3c2ff",
                    color: "#1a0829",
                    "&:hover": { backgroundColor: "#bfdcff" },
                  }}
                >
                  Make Variations
                </Button>
              </CardActions>
            </Card>
          ) : (
            <></>
          )}
        </Stack>
      )}
    </Box>
  );
}

export default App;
