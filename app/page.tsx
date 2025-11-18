import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Link2,
  Lock,
  Zap,
  Users,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              {"LinkShort"}
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                {"Sign in"}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">{"Get Started"}</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-36">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm text-muted-foreground mb-4">
              <Zap className="w-4 h-4 mr-2" />
              {"Trusted by thousands of developers worldwide"}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              {"Shorten Links,"}
              <span className="block text-primary">{"Track Performance"}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              {
                "The modern URL shortener built for developers and teams. Create, manage, and analyze your links with powerful, real-time analytics."
              }
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2 px-8">
                {"Start for free"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="px-8">
                {"View Live Demo"}
              </Button>
            </Link>
          </div>
          <div className="pt-8 text-sm text-muted-foreground">
            {"No credit card required • Free forever plan • Set up in minutes"}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold">10M+</div>
              <div className="text-sm text-muted-foreground">
                Links Shortened
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold">500ms</div>
              <div className="text-sm text-muted-foreground">
                Avg. Redirect Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              {"Built for developers who care about performance"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {
                "Everything you need to create, manage, and analyze your links at scale."
              }
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Link2 className="w-6 h-6" />}
              title="Custom Short Links"
              description="Create branded short links with custom aliases. Make your URLs memorable and trustworthy."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-time Analytics"
              description="Track clicks, locations, devices, and referrers with detailed, real-time insights."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Lightning Fast"
              description="Built for speed with global CDN. Your links redirect in milliseconds with 99.9% uptime."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Enterprise Security"
              description="End-to-end encryption and secure data handling. GDPR and CCPA compliant."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Team Collaboration"
              description="Share link collections, manage permissions, and collaborate seamlessly with your team."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Global Performance"
              description="Multiple data centers worldwide ensure fast redirects for your global audience."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-card rounded-xl p-12 border border-border shadow-sm">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              {"Ready to optimize your links?"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {
                "Join 50,000+ developers and marketers who trust LinkShort for their link management."
              }
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2 px-8">
                {"Create your account"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="px-8">
                {"Read Documentation"}
              </Button>
            </Link>
          </div>
          <div className="text-sm text-muted-foreground pt-4">
            {"Get started in 2 minutes • No credit card required"}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                <Link2 className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-tight">{"LinkShort"}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/docs"
                className="hover:text-foreground transition-colors"
              >
                {"Documentation"}
              </Link>
              <Link
                href="/pricing"
                className="hover:text-foreground transition-colors"
              >
                {"Pricing"}
              </Link>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                {"Privacy"}
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                {"Terms"}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              {"© 2025 LinkShort. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-8 rounded-xl border border-border bg-card hover:border-accent transition-all duration-300 hover:shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-6 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
