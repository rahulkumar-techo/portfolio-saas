/**
 * PortfolioPreview Component
 * Dynamically renders AI generated portfolio JSON
 */

export default function PortfolioPreview({ data }: { data: any }) {
  if (!data) return null

  return (
    <div className="p-6 space-y-6">

      <section className="text-center">
        <h1 className="text-3xl font-bold">{data.hero?.title}</h1>
        <p className="text-gray-600">{data.hero?.subtitle}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Projects</h2>
        <div className="grid gap-4 mt-3">
          {data.projects?.map((project: any, index: number) => (
            <div key={index} className="border p-4 rounded-lg">
              <h3 className="font-bold">{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}