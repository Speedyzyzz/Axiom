import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ExternalLink } from "lucide-react"

export default function Incidents() {
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/incidents")
      .then(res => setIncidents(res.data.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Incidents</h2>
        <Button onClick={() => {
          axios.post("http://127.0.0.1:8000/api/v1/demo/reset")
          .then(() => window.location.reload())
        }}>Seed Demo Data</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Score</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {incidents.map(inc => (
                  <tr key={inc.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">INC-{inc.id}</td>
                    <td className="p-4 align-middle">{inc.title}</td>
                    <td className="p-4 align-middle">
                      <span className={`font-bold ${inc.confidence_score > 70 ? "text-destructive" : "text-amber-500"}`}>
                        {inc.confidence_score}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant={inc.status === 'open' ? 'destructive' : 'secondary'}>{inc.status.toUpperCase()}</Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Link to={`/incidents/${inc.id}`}>
                        <Button variant="outline" size="sm">
                          Investigate <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No incidents found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
