import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, MapPin, Mail, Phone, Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/perfil")({
  component: ProfilePage,
});

type ProfileForm = {
  name: string;
  email: string;
  address: string;
  phone: string;
};

const EMPTY_PROFILE: ProfileForm = {
  name: "",
  email: "",
  address: "",
  phone: "",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(EMPTY_PROFILE);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await api<ProfileForm & { avatarUrl?: string | null }>("/api/user");
        setForm({
          name: profile.name ?? "",
          email: profile.email ?? "",
          address: profile.address ?? "",
          phone: profile.phone ?? "",
        });
        setPhoto(profile.avatarUrl ?? null);
      } catch (error: any) {
        toast.error(error?.message || "Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A foto deve ter no máximo 2 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const updatedProfile = await api<ProfileForm & { avatarUrl?: string | null }>("/api/user", {
        method: "PUT",
        body: JSON.stringify({ ...form, avatarUrl: photo }),
      });
      setForm({
        name: updatedProfile.name ?? "",
        email: updatedProfile.email ?? "",
        address: updatedProfile.address ?? "",
        phone: updatedProfile.phone ?? "",
      });
      setPhoto(updatedProfile.avatarUrl ?? null);
      toast.success("Perfil atualizado");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sua conta</p>
          <h1 className="font-display text-4xl font-bold tracking-tight">Perfil</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Mantenha seus dados pessoais atualizados para uma experiência mais completa.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit border-border bg-card">
            <CardContent className="flex flex-col items-center gap-5 p-6 text-center">
              <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-sm">
                <AvatarImage src={photo ?? undefined} alt="Foto de perfil" />
                <AvatarFallback className="bg-primary/15 text-3xl font-semibold text-primary">
                  {getInitials(form.name) || <UserRound className="h-10 w-10" />}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">Foto de perfil</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG ou JPG de até 2 MB</p>
              </div>

              <Button type="button" variant="outline" asChild className="w-full">
                <label className="cursor-pointer">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Escolher foto
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Dados pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nome</Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Seu nome completo"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="voce@exemplo.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Telefone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profile-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="(00) 00000-0000"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-address">Endereço</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="profile-address"
                    value={form.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="Rua, número, bairro, cidade e estado"
                    className="min-h-24 pl-9"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-border/60 pt-5">
                <Button
                  type="submit"
                  disabled={loading || saving}
                  className="bg-primary text-primary-foreground hover:opacity-90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppShell>
  );
}
