import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, MapPin, Mail, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import DaySelector from "@/components/day-selector";
import TimeSlotGrid from "@/components/time-slot-grid";
import BookingForm from "@/components/booking-form";
import ConfirmationMessage from "@/components/confirmation-message";
import type { Booking } from "@shared/schema";

export default function Home() {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  const [selectedDay, setSelectedDay] = useState<string>(todayKey);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showDays, setShowDays] = useState<boolean>(false);
  const [showTimes, setShowTimes] = useState<boolean>(false);

  const handleBookingConfirmed = (booking: Booking) => {
    setConfirmedBooking(booking);
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    setSelectedTime("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Project Owner Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold">S</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold truncate">مطور بواسطة: sepan_b_ahmad</p>
                <p className="text-xs opacity-90 hidden sm:block">مطور تطبيقات ومواقع ويب</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <a
                href="https://www.facebook.com/share/1LmBX9H1uE/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/sepan_b_ahmad?igsh=MTg0d3dqZGs1eGlhMA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@sepan_b_ahmad?_t=ZS-8x8HB46qGcK&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                title="TikTok"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>

              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-70" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {!confirmedBooking ? (
          <>
            {/* Day Selection */}
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowDays(!showDays)}
              >
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="text-primary ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                  {selectedDate ? (
                    `التاريخ المختار: ${(() => {
                      const date = new Date(selectedDate);
                      const monthNames = [
                        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
                      ];
                      return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                    })()}`
                  ) : (
                    `اختر التاريخ - ${(() => {
                      const now = new Date();
                      const monthNames = [
                        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
                      ];
                      return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
                    })()}`
                  )}
                </h2>
                <Button variant="ghost" size="sm">
                  {showDays ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {showDays && (
                <div className="mt-6">
                  <DaySelector
                    selectedDay={selectedDay}
                    selectedDate={selectedDate}
                    onDaySelect={(day, date) => {
                      setSelectedDay(day);
                      setSelectedDate(date);
                      setSelectedTime(""); // Reset time selection when day changes
                      setShowDays(false); // Hide days after selection
                      setShowTimes(true); // Show times after selecting date
                    }}
                  />

                  {/* Days Legend */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-sm mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 border border-green-400 rounded ml-2"></div>
                      <span className="text-gray-600">متاح</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-primary rounded ml-2"></div>
                      <span className="text-gray-600">محدد</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-200 border border-orange-500 rounded ml-2"></div>
                      <span className="text-gray-600">محجوز جزئياً</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-200 border border-red-500 rounded ml-2"></div>
                      <span className="text-gray-600">محجوز بالكامل</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Time Selection */}
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowTimes(!showTimes)}
              >
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Clock className="text-primary ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                  {selectedTime ? (
                    `الوقت المختار: ${selectedTime}`
                  ) : (
                    `اختر الوقت - ${selectedDate ? (() => {
                      const date = new Date(selectedDate);
                      const monthNames = [
                        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
                      ];
                      return `${date.getDate()} ${monthNames[date.getMonth()]}`;
                    })() : 'اختر التاريخ أولاً'}`
                  )}
                </h2>
                <Button variant="ghost" size="sm">
                  {showTimes ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {showTimes && selectedDate && (
                <div className="mt-6">
                  <TimeSlotGrid
                    selectedDay={selectedDay}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onTimeSelect={(time) => {
                      setSelectedTime(time);
                      setShowTimes(false); // Hide times after selection
                    }}
                  />
                </div>
              )}
            </Card>

            {/* Booking Form */}
            {selectedTime && (
              <BookingForm
                selectedDay={selectedDay}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onBookingConfirmed={handleBookingConfirmed}
              />
            )}
          </>
        ) : (
          <ConfirmationMessage
            booking={confirmedBooking}
            onNewBooking={handleNewBooking}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 mt-8 sm:mt-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">ملاعب كردستان</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                أفضل ملاعب كرة القدم المصغرة في كردستان. احجز ملعبك الآن واستمتع بتجربة لعب لا تُنسى.
              </p>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">معلومات الاتصال</h4>
              <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 ml-2 flex-shrink-0" />
                  <span dir="ltr">07508275402</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 ml-2 flex-shrink-0" />
                  <span className="break-all">sepodoske09@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 ml-2 flex-shrink-0" />
                  ناحية مانكيشك
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">المطور</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">S</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Sepan Bahraz Ahmad</p>
                    <p className="text-gray-400 text-xs">مطور تطبيقات ومواقع ويب</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.facebook.com/share/1LmBX9H1uE/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors group"
                    title="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  <a
                    href="https://www.instagram.com/sepan_b_ahmad?igsh=MTg0d3dqZGs1eGlhMA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-colors group"
                    title="Instagram"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  <a
                    href="https://www.tiktok.com/@sepan_b_ahmad?_t=ZS-8x8HB46qGcK&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors group"
                    title="TikTok"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-right">
                &copy; 2025 جميع الحقوق محفوظة - ملاعب كردستان
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>تطوير:</span>
                <span className="text-white font-semibold">Sepan Bahraz Ahmad</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span>مطور مواقع ويب</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
