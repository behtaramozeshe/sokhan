"use client";
import { Box, Typography, Button } from "@mui/material";

// Define props type
interface HeroProps {
  onCallToActionClick: () => void; // Function that takes no args and returns void
}

export default function Hero({ onCallToActionClick }: HeroProps) {
  return (
    <Box
      sx={{
        backgroundColor: "orange",
        padding: 4,
        textAlign: "center",
        color: "white",
        direction: "rtl",
      }}
    >
      <Typography variant="h2" gutterBottom>
        به سخن نگار خوش آمدید
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onCallToActionClick}
        sx={{
          backgroundColor: "white",
          color: "orange",
          "&:hover": { backgroundColor: "#f0f0f0" },
          padding: "12px 24px",
        }}
      >
        متن تبلیغاتی با هوش مصنوعی درست کنید
      </Button>
    </Box>
  );
}
