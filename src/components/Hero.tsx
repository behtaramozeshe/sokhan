import { Box, Typography, Button } from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{
        backgroundColor: "orange", // Matches your app’s theme
        padding: 4,
        textAlign: "center",
        color: "white",
        direction: "rtl", // Right-to-left for Persian
      }}
    >
      <Typography variant="h2" gutterBottom>
        به سخن نگار خوش آمدید
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: "white",
          color: "orange",
          "&:hover": { backgroundColor: "#f0f0f0" }, // Subtle hover effect
          padding: "12px 24px", // Makes the button big and clickable
        }}
      >
        متن تبلیغاتی با هوش مصنوعی درست کنید
      </Button>
    </Box>
  );
}
