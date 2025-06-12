import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface Day {
  key: string;
  name: string;
  date: string;
  bookingStatus?: 'available' | 'partial' | 'full';
}

interface DaySelectorProps {
  selectedDay: string;
  selectedDate: string;
  onDaySelect: (day: string, date: string) => void;
}

export default function DaySelector({ selectedDay, selectedDate, onDaySelect }: DaySelectorProps) {
  // Get Arabic month name
  const getMonthName = (monthIndex: number): string => {
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return monthNames[monthIndex];
  };

  // Generate all available time slots (same as TimeSlotGrid)
  const getAllTimeSlots = (): string[] => {
    const slots: string[] = [];

    // 3 PM to 11 PM (15:00 to 23:00)
    for (let hour = 15; hour <= 23; hour++) {
      slots.push(`${hour}:00`);
    }

    // 12 AM to 2 AM (00:00 to 02:00)
    for (let hour = 0; hour <= 2; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return slots;
  };

  const allTimeSlots = getAllTimeSlots();
  const totalSlotsPerDay = allTimeSlots.length; // Should be 12

  // Check booking status of a day
  const checkDayBookingStatus = (dayKey: string, dateString: string) => {
    return useQuery({
      queryKey: [`/api/bookings/day/${dayKey}/${dateString}`],
      enabled: !!dayKey && !!dateString,
      select: (bookings: any[]): 'available' | 'partial' | 'full' => {
        if (!bookings || bookings.length === 0) return 'available';

        const bookedTimes = new Set(bookings.map((b: any) => b.time));
        const bookedCount = bookedTimes.size;

        if (bookedCount >= totalSlotsPerDay) {
          return 'full'; // Fully booked
        } else if (bookedCount > 0) {
          return 'partial'; // Partially booked
        } else {
          return 'available'; // Available
        }
      },
    });
  };

  // Generate all days of current month starting from today
  const generateDays = (): Day[] => {
    const days = [];
    const dayNames = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
    const arabicDayNames = [
      'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
    ];

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get the last day of current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Start from today and go to end of month
    for (let day = today.getDate(); day <= lastDayOfMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayIndex = date.getDay();
      const formattedDate = `${day} ${getMonthName(currentMonth)}`;

      days.push({
        key: `${currentYear}-${currentMonth + 1}-${day}`, // Unique key for each day
        name: arabicDayNames[dayIndex],
        date: formattedDate,
      });
    }

    return days;
  };

  const days = generateDays();

  const getDateString = (dayKey: string): string => {
    // Extract date from the key format: "2024-12-15"
    const [year, month, day] = dayKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 max-h-80 sm:max-h-96 overflow-y-auto">
      {days.map((day) => {
        const dateString = getDateString(day.key);
        const { data: bookingStatus, isLoading } = checkDayBookingStatus(day.key, dateString);

        const getButtonClasses = () => {
          const baseClasses = "p-2 sm:p-3 h-auto transition-all duration-200";

          if (selectedDay === day.key) {
            return `${baseClasses} bg-primary text-white border-primary`;
          }

          switch (bookingStatus) {
            case 'full':
              return `${baseClasses} bg-red-100 border-red-500 text-red-800 cursor-not-allowed opacity-75 hover:bg-red-100 hover:border-red-500 hover:text-red-800`;
            case 'partial':
              return `${baseClasses} bg-orange-100 border-orange-500 text-orange-800 hover:bg-orange-200 hover:border-orange-600 hover:text-orange-900`;
            case 'available':
            default:
              return `${baseClasses} bg-green-50 border-green-300 text-green-800 hover:bg-primary hover:text-white hover:border-primary`;
          }
        };

        const getStatusText = () => {
          switch (bookingStatus) {
            case 'full':
              return 'محجوز بالكامل';
            case 'partial':
              return 'محجوز جزئياً';
            case 'available':
            default:
              return null;
          }
        };

        const isDisabled = bookingStatus === 'full';

        return (
          <Button
            key={day.key}
            variant={selectedDay === day.key ? "default" : "outline"}
            className={getButtonClasses()}
            onClick={() => {
              if (!isDisabled) {
                onDaySelect(day.key, dateString);
              }
            }}
            disabled={isDisabled}
          >
            <div className="text-center">
              <div className="text-sm sm:text-base font-semibold mb-1">{day.name}</div>
              <div className="text-xs opacity-75">{day.date}</div>
              {getStatusText() && (
                <div className="text-xs mt-1 font-medium">{getStatusText()}</div>
              )}
              {isLoading && (
                <div className="text-xs mt-1">...</div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
