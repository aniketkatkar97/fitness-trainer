import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Dumbbell, LineChart, Video } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Dumbbell className="h-6 w-6" />
          <span className="sr-only">Fitness Trainer</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#get-started"
          >
            Get Started
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Personal AI Fitness Trainer
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Perfect your form, track your progress, and achieve your
                  fitness goals with our AI-powered workout assistant.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="#get-started">Get Started</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
              <Card>
                <CardHeader>
                  <Video className="h-10 w-10 mb-2" />
                  <CardTitle>Real-time Form Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  Get instant feedback on your exercise form to prevent injuries
                  and maximize results.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle className="h-10 w-10 mb-2" />
                  <CardTitle>Guided Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  Follow along with our AI trainer for a complete fitness
                  routine tailored to your needs.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <LineChart className="h-10 w-10 mb-2" />
                  <CardTitle>Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  Monitor your improvements over time with detailed performance
                  analytics.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Dumbbell className="h-10 w-10 mb-2" />
                  <CardTitle>Customizable Routines</CardTitle>
                </CardHeader>
                <CardContent>
                  Create personalized workout plans that fit your fitness level
                  and goals.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  1
                </div>
                <h3 className="text-xl font-bold">Set Up Your Camera</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Position your device so the camera can see your full body
                  during exercises.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  2
                </div>
                <h3 className="text-xl font-bold">Choose Your Workout</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select from our pre-designed routines or create your own
                  custom workout.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  3
                </div>
                <h3 className="text-xl font-bold">Follow Along</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Perform the exercises while our AI analyzes your form and
                  counts your reps.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="get-started"
          className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
        >
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Your Workouts?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                  Join thousands of users who have improved their fitness with
                  our AI trainer. Start your journey today!
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-background text-primary hover:bg-background/90"
              >
                <Link href="/signup">Sign Up for Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Fitness Trainer. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
