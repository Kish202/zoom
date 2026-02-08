import ClassView from "./components/ClassView";

async function getClasses() {
  const res = await fetch(
    `${process.env.SUPABASE_API_URL}?date=2026-02-08&page=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_BEARER_TOKEN}`,
        Accept: "*/*",
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return [];

  const json = await res.json();
  return json.data?.classes ?? [];
}

// Two dummy classes for testing LIVE and countdown states
function getDummyClasses() {
  const now = new Date();

  // live
  const liveStart = new Date(now.getTime() - 5 * 60000);

 // Countdown
  const soonStart = new Date(now.getTime() + 15 * 60000);

  return [
    {
      id: "dummy-live",
      title: "Tabata Blast: 20 Minutes of Intensity",
      description:
        "Push your limits with this intense Tabata-style workout! Short bursts of all-out effort followed by brief rest periods.\n\nThis class will test your endurance and mental toughness. Expect explosive movements, high heart rates, and maximum calorie burn.\n\nWhat to expect:\n- 20-second work intervals at max effort\n- 10-second rest periods\n- 8 rounds per exercise\n- Full body movements",
      image_url: "/Thumbnail.jpg",
      start_datetime: liveStart.toISOString(),
      duration_minutes: 20,
      intensity: "High",
      difficulty_level: "All Levels",
      category: "HIIT & Boxing",
      equipment_requirements: "None",
      instructor: {
        name: "Marcus Johnson",
        avatar_url: "/instruct.jpg",
      },
    },
    {
      id: "dummy-soon",
      title: "HIIT Bootcamp",
      description:
        "Get ready to sweat in this high-intensity interval training session! Marcus will push you through challenging exercises designed to maximize calorie burn and build endurance.\n\nThis 30-minute bootcamp is packed with explosive movements, cardio intervals, and bodyweight exercises. Perfect for those short on time but want maximum results.\n\nClass structure:\n- 5-minute dynamic warm-up\n- 20 minutes of HIIT intervals (30 sec work / 15 sec rest)\n- 5-minute cool-down and stretch\n\nExercises include burpees, mountain climbers, jump squats, and more. Bring your energy and be ready to give it your all!",
      image_url: "/Thumbnail2.jpg",
      start_datetime: soonStart.toISOString(),
      duration_minutes: 30,
      intensity: "High",
      difficulty_level: "Intermediate",
      category: "HIIT & Boxing",
      equipment_requirements: "None",
      instructor: {
        name: "Marcus Johnson",
        avatar_url: "/instruct.jpg",
      },
    },
  ];
}

export default async function Home() {
  const apiClasses = await getClasses();
  const dummyClasses = getDummyClasses();

  // Dummy classes first so LIVE one is featured, then API classes
  const classes = [...dummyClasses, ...apiClasses];

  if (!classes.length) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-zinc-400">No classes available.</p>
      </main>
    );
  }

  return <ClassView classes={classes} />;
}
