import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import TimelineFlow from "../components/TimelineFlow"
import { motion, AnimatePresence } from "framer-motion"

export default function Investigation() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [replayState, setReplayState] = useState(0)
  const [isReplaying, setIsReplaying] = useState(false)

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/incidents/${id}`)
      .then(res => {
        setData(res.data.data)
        setReplayState(res.data.data.timeline.length)
      })
      .catch(err => console.error(err))
  }, [id])

  const startReplay = () => {
    setReplayState(0)
    setIsReplaying(true)
    let current = 0
    const interval = setInterval(() => {
      current += 1
      if (current >= data.timeline.length) {
        clearInterval(interval)
        setIsReplaying(false)
      }
      setReplayState(current)
    }, 800)
  }

  if (!data) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading investigation details...</div>

  const isTimelineComplete = replayState >= data.timeline.length
  const visibleTimeline = data.timeline.slice(0, replayState)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{data.incident_title}</h2>
          <p className="text-muted-foreground mt-1">Incident #{id} • Auto-generated Investigation Narrative</p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" onClick={startReplay} disabled={isReplaying}>Replay Investigation</Button>
          <Button variant="outline" onClick={() => window.print()}>Export Report</Button>
          <Button variant="outline">Reset Password</Button>
          <Button variant="secondary">Escalate SOC</Button>
          <Button variant="destructive">Freeze Transaction</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <AnimatePresence>
            {isTimelineComplete && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Confidence Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-destructive">{data.confidence}%</div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Root Cause</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{data.root_cause}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Business Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-amber-700 font-medium">{data.business_impact}</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="hover:shadow-md transition-shadow border-destructive shadow-sm shadow-destructive/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-destructive">Recommended Action</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium border border-destructive/20">
                        {data.recommended_action}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="col-span-2 space-y-6">
          <AnimatePresence>
            {isTimelineComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>Key Evidence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {data.evidence?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors">
                            <Badge variant="outline" className="mt-0.5 shrink-0 bg-white">{idx + 1}</Badge>
                            <span className="text-sm text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Card className="flex-1 overflow-hidden">
            <CardHeader>
              <CardTitle>Attack Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {visibleTimeline.length > 0 ? (
                <TimelineFlow events={visibleTimeline} />
              ) : (
                <div className="p-8 text-center text-muted-foreground">Initializing timeline replay...</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
