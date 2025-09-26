import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, Building, Users, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { HolographicCard, HolographicButton } from "./HolographicUI";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  firstName: z.string().min(2, "Vorname muss mindestens 2 Zeichen haben"),
  lastName: z.string().min(2, "Nachname muss mindestens 2 Zeichen haben"),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  phone: z.string().optional(),
  company: z.string().min(2, "Firmenname ist erforderlich"),
  website: z.string().url("Bitte geben Sie eine gültige Website-URL ein").optional().or(z.literal("")),
  employeeCount: z.string().min(1, "Bitte wählen Sie die Mitarbeiteranzahl"),
  industry: z.string().min(1, "Bitte wählen Sie Ihre Branche"),
  interestedModules: z.array(z.string()).min(1, "Bitte wählen Sie mindestens ein Modul"),
  currentChallenges: z.string().min(10, "Bitte beschreiben Sie Ihre Herausforderungen (mindestens 10 Zeichen)"),
  budget: z.string().min(1, "Bitte wählen Sie Ihr Budget"),
  timeline: z.string().min(1, "Bitte wählen Sie Ihren Zeitrahmen"),
  additionalInfo: z.string().optional(),
  acceptPrivacy: z.boolean().refine(val => val === true, "Sie müssen den Datenschutzbestimmungen zustimmen"),
  acceptNewsletter: z.boolean().optional()
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const employeeRanges = [
  { value: "1-10", label: "1-10 Mitarbeiter (Startup)" },
  { value: "11-50", label: "11-50 Mitarbeiter (Klein)" },
  { value: "51-200", label: "51-200 Mitarbeiter (Mittel)" },
  { value: "201-999", label: "201-999 Mitarbeiter (Groß)" },
  { value: "1000+", label: "1000+ Mitarbeiter (Enterprise)" }
];

const industries = [
  { value: "technology", label: "Technologie & Software" },
  { value: "manufacturing", label: "Produktion & Fertigung" },
  { value: "retail", label: "Einzelhandel & E-Commerce" },
  { value: "healthcare", label: "Gesundheitswesen" },
  { value: "finance", label: "Finanzdienstleistungen" },
  { value: "consulting", label: "Beratung & Services" },
  { value: "real-estate", label: "Immobilien" },
  { value: "education", label: "Bildung & Forschung" },
  { value: "logistics", label: "Logistik & Transport" },
  { value: "other", label: "Andere" }
];

const modules = [
  { id: "support", name: "Multichannel-Kundensupport", description: "KI-Chat & Voice-Agenten" },
  { id: "automation", name: "Prozessautomatisierung", description: "Workflow & Dokumenten-Automation" },
  { id: "analytics", name: "Content & Datenanalyse", description: "Marketing-Content & Business Intelligence" },
  { id: "security", name: "IT-Sicherheitspaket", description: "Bedrohungserkennung & Patch-Management" },
  { id: "extras", name: "Zusatzmodule", description: "Kundenfeedback & Vertriebsunterstützung" }
];

const budgetRanges = [
  { value: "5k-15k", label: "€5.000 - €15.000" },
  { value: "15k-50k", label: "€15.000 - €50.000" },
  { value: "50k-100k", label: "€50.000 - €100.000" },
  { value: "100k+", label: "€100.000+" }
];

const timelines = [
  { value: "asap", label: "So schnell wie möglich" },
  { value: "1-3months", label: "1-3 Monate" },
  { value: "3-6months", label: "3-6 Monate" },
  { value: "6months+", label: "Über 6 Monate" }
];

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      website: "",
      employeeCount: "",
      industry: "",
      interestedModules: [],
      currentChallenges: "",
      budget: "",
      timeline: "",
      additionalInfo: "",
      acceptPrivacy: false,
      acceptNewsletter: false
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Anfrage gesendet!",
        description: "Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
      console.error('Contact form error:', error);
    }
  });

  const onSubmit = (data: ContactFormData) => {
    submitMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <HolographicCard className="max-w-2xl mx-auto text-center" data-testid="contact-success">
        <CardContent className="pt-8">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold">Vielen Dank für Ihre Anfrage!</h3>
            <p className="text-muted-foreground">
              Unser KI-Experten-Team wird Ihre Anfrage prüfen und sich innerhalb von 24 Stunden bei Ihnen melden, 
              um eine maßgeschneiderte Lösung für Ihr Unternehmen zu besprechen.
            </p>
            <div className="pt-4">
              <Badge variant="outline" className="px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Prioritätsbearbeitung aktiviert
              </Badge>
            </div>
          </div>
        </CardContent>
      </HolographicCard>
    );
  }

  return (
    <section className="py-20 px-4 relative" id="kontakt">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold gradient-text" data-testid="heading-contact">
            Jetzt Beratung anfordern
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-contact-description">
            Lassen Sie uns gemeinsam herausfinden, wie KI Ihr Unternehmen revolutionieren kann.
          </p>
        </div>

        <HolographicCard data-testid="contact-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Kostenlose Erstberatung
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Alle Felder mit * sind Pflichtfelder. Ihre Daten werden DSGVO-konform verarbeitet.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname *</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    placeholder="Max"
                    data-testid="input-first-name"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname *</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    placeholder="Mustermann"
                    data-testid="input-last-name"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="max@unternehmen.de"
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    placeholder="+49 123 456789"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Unternehmen *</Label>
                  <Input
                    id="company"
                    {...form.register("company")}
                    placeholder="Muster GmbH"
                    data-testid="input-company"
                  />
                  {form.formState.errors.company && (
                    <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    {...form.register("website")}
                    placeholder="https://unternehmen.de"
                    data-testid="input-website"
                  />
                  {form.formState.errors.website && (
                    <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Mitarbeiteranzahl *</Label>
                  <Select onValueChange={(value) => form.setValue("employeeCount", value)}>
                    <SelectTrigger data-testid="select-employees">
                      <SelectValue placeholder="Wählen Sie die Anzahl" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.employeeCount && (
                    <p className="text-sm text-destructive">{form.formState.errors.employeeCount.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Branche *</Label>
                  <Select onValueChange={(value) => form.setValue("industry", value)}>
                    <SelectTrigger data-testid="select-industry">
                      <SelectValue placeholder="Wählen Sie Ihre Branche" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.industry && (
                    <p className="text-sm text-destructive">{form.formState.errors.industry.message}</p>
                  )}
                </div>
              </div>

              {/* Interested Modules */}
              <div className="space-y-4">
                <Label>Interessante KI-Module * (Mehrfachauswahl möglich)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={module.id}
                        onCheckedChange={(checked) => {
                          const current = form.getValues("interestedModules");
                          if (checked) {
                            form.setValue("interestedModules", [...current, module.id]);
                          } else {
                            form.setValue("interestedModules", current.filter(id => id !== module.id));
                          }
                        }}
                        data-testid={`checkbox-${module.id}`}
                      />
                      <div className="space-y-1">
                        <label htmlFor={module.id} className="text-sm font-medium cursor-pointer">
                          {module.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {form.formState.errors.interestedModules && (
                  <p className="text-sm text-destructive">{form.formState.errors.interestedModules.message}</p>
                )}
              </div>

              {/* Current Challenges */}
              <div className="space-y-2">
                <Label htmlFor="currentChallenges">Aktuelle Herausforderungen *</Label>
                <Textarea
                  id="currentChallenges"
                  {...form.register("currentChallenges")}
                  placeholder="Beschreiben Sie Ihre aktuellen Geschäftsherausforderungen, die durch KI gelöst werden könnten..."
                  rows={4}
                  data-testid="textarea-challenges"
                />
                {form.formState.errors.currentChallenges && (
                  <p className="text-sm text-destructive">{form.formState.errors.currentChallenges.message}</p>
                )}
              </div>

              {/* Budget and Timeline */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Geschätztes Budget *</Label>
                  <Select onValueChange={(value) => form.setValue("budget", value)}>
                    <SelectTrigger data-testid="select-budget">
                      <SelectValue placeholder="Wählen Sie Ihr Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((budget) => (
                        <SelectItem key={budget.value} value={budget.value}>
                          {budget.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.budget && (
                    <p className="text-sm text-destructive">{form.formState.errors.budget.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Gewünschter Zeitrahmen *</Label>
                  <Select onValueChange={(value) => form.setValue("timeline", value)}>
                    <SelectTrigger data-testid="select-timeline">
                      <SelectValue placeholder="Wählen Sie den Zeitrahmen" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelines.map((timeline) => (
                        <SelectItem key={timeline.value} value={timeline.value}>
                          {timeline.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.timeline && (
                    <p className="text-sm text-destructive">{form.formState.errors.timeline.message}</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Zusätzliche Informationen</Label>
                <Textarea
                  id="additionalInfo"
                  {...form.register("additionalInfo")}
                  placeholder="Weitere wichtige Details zu Ihrem Projekt..."
                  rows={3}
                  data-testid="textarea-additional"
                />
              </div>

              {/* Privacy and Newsletter */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptPrivacy"
                    {...form.register("acceptPrivacy")}
                    data-testid="checkbox-privacy"
                  />
                  <label htmlFor="acceptPrivacy" className="text-sm cursor-pointer">
                    Ich stimme der <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> zu und bin damit einverstanden, dass meine Daten zur Bearbeitung meiner Anfrage gespeichert werden. *
                  </label>
                </div>
                {form.formState.errors.acceptPrivacy && (
                  <p className="text-sm text-destructive">{form.formState.errors.acceptPrivacy.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptNewsletter"
                    {...form.register("acceptNewsletter")}
                    data-testid="checkbox-newsletter"
                  />
                  <label htmlFor="acceptNewsletter" className="text-sm cursor-pointer">
                    Ich möchte regelmäßig über neue KI-Lösungen und Best Practices informiert werden.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <HolographicButton 
                  data-testid="button-submit-contact"
                  className={submitMutation.isPending ? "opacity-50" : ""}
                >
                  <span className="flex items-center gap-2">
                    {submitMutation.isPending ? "Wird gesendet..." : "Kostenlose Beratung anfordern"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </HolographicButton>
              </div>
            </form>
          </CardContent>
        </HolographicCard>
      </div>
    </section>
  );
}