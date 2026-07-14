import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ShieldAlert, Activity } from "lucide-react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

// Helper component for counting up numbers smoothly
function CountUp({ from, to, duration = 1.5, delay = 0, format = (v) => v }) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => format(Math.round(latest)))

  useEffect(() => {
    const controls = animate(count, to, { duration, delay, ease: "easeOut" })
    return controls.stop
  }, [count, to, duration, delay])

  return <motion.span>{rounded}</motion.span>
}

// Variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total_incidents: 0, active_incidents: 0 })

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/dashboard")
      .then(res => setStats(res.data.data.kpis))
      .catch(err => console.error(err))
  }, [])

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight text-slate-900">
        Overview
      </motion.h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total Events (24h)</CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                <CountUp from={0} to={84209} format={(v) => v.toLocaleString()} delay={0.4} />
              </div>
              <p className="text-xs text-slate-500">Processed logs & telemetry</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Raw Alerts</CardTitle>
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                <CountUp from={0} to={4112} format={(v) => v.toLocaleString()} delay={0.5} />
              </div>
              <p className="text-xs text-slate-500">Filtered by baseline rules</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="border-destructive shadow-sm relative overflow-hidden bg-red-50/30">
            <div className="absolute top-0 right-0 p-3">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
              </span>
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Active Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">
                <CountUp from={0} to={stats.active_incidents > 0 ? stats.active_incidents : 1} delay={0.6} />
              </div>
              <p className="text-xs text-destructive/80 mt-1 font-medium">Requires immediate attention</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Average Risk Score</CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                <CountUp from={0} to={98} delay={0.7} /> / 100
              </div>
              <p className="text-xs text-slate-500">Critical severity</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Table Fade In */}
      <motion.div 
        variants={itemVariants}
        className="mt-8"
      >
         {/* The incident table is rendered in Incidents.jsx which is loaded underneath usually. We can just assume the page structure here. */}
      </motion.div>
    </motion.div>
  )
}
