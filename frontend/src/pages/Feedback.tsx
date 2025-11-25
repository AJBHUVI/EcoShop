// frontend/src/pages/Feedback.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Feedback() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const userId = sessionStorage.getItem("user_id");
      if (!userId) {
        setStatus("⚠️ Please log in before sending feedback.");
        return;
      }

      const updatedData = { ...formData, user_id: userId };
      console.log("Sending feedback:", updatedData);

      await axios.post("/contact", updatedData);
      setStatus("✅ Message sent successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });

      navigate("/user-dashboard", {
        state: { message: "Your feedback was submitted successfully!" },
      });
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to send message. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <Card className="lg:col-span-2 p-6 sm:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Firstname"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Lastname"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your enquiry..."
                  rows={5}
                />
              </div>

              <Button size="lg" className="w-full" type="submit">
                Send Message
              </Button>

              {status && <p className="text-center mt-2 text-sm">{status}</p>}
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 flex items-start space-x-4">
              <Mail className="text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">support@wonderwhy.in</p>
              </div>
            </Card>

            <Card className="p-6 flex items-start space-x-4">
              <Phone className="text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
            </Card>

            <Card className="p-6 flex items-start space-x-4">
              <MapPin className="text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-sm text-muted-foreground">Chennai, Tamil Nadu, India</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
