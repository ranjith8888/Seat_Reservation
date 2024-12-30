'use client'

import { useState, useEffect, use } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import apiRoutes from '../../routes'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, LogOut } from 'lucide-react'

interface Seat {
  id: number
  isBooked: boolean
}

const initialSeats: Seat[] = Array.from({ length: 80 }, (_, index) => ({
  id: index + 1,
  isBooked: false
}))

const MAX_SEATS = 7
const SEATS_PER_ROW = 7

export default function SeatBookingPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('login') !== "true") {
      window.location.href = '/'
    }
  }, [])
  const [seats, setSeats] = useState<Seat[]>(initialSeats)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [seatCount, setSeatCount] = useState<number>(0)

  
  //@console.log(seats)
  useEffect(() => {
    fetch(apiRoutes.TICKET, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then((data) => {
      console.log(data)
      let dataBaseSeats = [];
      if(data && data.latestTicket[0] && data.latestTicket[0].ticketsRemaining){
      for (let i = 0; i < data.latestTicket[0].ticketsRemaining.length; i++) {
        if (data.latestTicket[0].ticketsRemaining[i] == -1) {
          dataBaseSeats.push({ "id": i + 1, "isBooked": true });
        }
        else {
          dataBaseSeats.push({ "id": i + 1, "isBooked": false });
        }
      }
      setSeats(dataBaseSeats)
    }
    })
    //setSeats(d);
  }, [])
  const availableSeats = seats.filter(seat => !seat.isBooked).length
  const bookedSeats = seats.length - availableSeats
  useEffect(() => {
    if (seatCount > 0) {
      const newSelectedSeats = findAdjacentSeats(seatCount)
      setSelectedSeats(newSelectedSeats)
    } else {
      setSelectedSeats([])
    }
  }, [seatCount, seats])

  const findAdjacentSeats = (count: number): number[] => {
    for (let startIndex = 0; startIndex < seats.length - count + 1; startIndex++) {
      const potentialSeats = seats.slice(startIndex, startIndex + count)
      if (potentialSeats.every(seat => !seat.isBooked) &&
        Math.floor(startIndex / SEATS_PER_ROW) === Math.floor((startIndex + count - 1) / SEATS_PER_ROW)) {
        return potentialSeats.map(seat => seat.id)
      }
    }
    // If no adjacent seats found, fall back to selecting any available seats
    return seats.filter(seat => !seat.isBooked).slice(0, count).map(seat => seat.id)
  }

  const handleSeatCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Math.min(Math.max(0, parseInt(e.target.value) || 0), MAX_SEATS)
    setSeatCount(count)
  }

  const handleBooking = () => {
    if (selectedSeats.length > 0) {
      const a=seats.map(seat =>
        selectedSeats.includes(seat.id) ? { ...seat, isBooked: true } : seat
      )
      console.log(a)
      setSeats(seats.map(seat =>
        selectedSeats.includes(seat.id) ? { ...seat, isBooked: true } : seat
      ))
      setSelectedSeats([])
      setSeatCount(0)
      console.log(seats)
      const data = {
        "ticketsRemaining": a.map(seat => !seat.isBooked ? seat.id : -1),
      }
      fetch(apiRoutes.TICKET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      }).then(response => response.json()).then((data) => {
        console.log(data)
      })
    }
  }

  const handleReset = () => {
    const data = {
      "ticketsRemaining": initialSeats.map(seat => !seat.isBooked ? seat.id : -1),
    }
    fetch(apiRoutes.TICKET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    }).then(response => response.json()).then((data) => {
      console.log(data)
    })
    setSeats(initialSeats)
    setSelectedSeats([])
    setSeatCount(0)
  }
  const signout = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('login', "false")
      window.location.href = '/'
    }
  }
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end">
        <button onClick={signout} className="mt-4 bg-black text-white px-4 py-2 rounded">Log Out</button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Seat Booking</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left side: Seat Layout */}
        <Card>
          <CardHeader>
            <CardTitle>Seat Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${seat.isBooked
                      ? 'bg-red-500 text-white'
                      : selectedSeats.includes(seat.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                >
                  {seat.id}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right side: Booking Form and Status */}
        <Card>
          <CardHeader>
            <CardTitle>Book Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <Label htmlFor="seatCount">Number of Seats (Max {MAX_SEATS})</Label>
                <Input
                  id="seatCount"
                  type="number"
                  min={0}
                  max={MAX_SEATS}
                  value={seatCount}
                  onChange={handleSeatCountChange}
                />
              </div>
              <div>
                <Label htmlFor="seats">Selected Seats</Label>
                <Input
                  id="seats"
                  value={selectedSeats.join(', ')}
                  readOnly
                />
              </div>
              {seatCount === MAX_SEATS && (
                <div className="flex items-center text-yellow-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Maximum seats selected</span>
                </div>
              )}
              {seatCount > availableSeats && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Not enough available seats</span>
                </div>
              )}
              <Button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || seatCount > availableSeats}
              >
                Book Now ({selectedSeats.length})
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <p>Available Seats: {availableSeats}</p>
              <p>Booked Seats: {bookedSeats}</p>
              <p>Total Seats: {seats.length}</p>
            </div>

            <Button onClick={handleReset} className="mt-4" variant="outline">
              Reset All Seats
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

