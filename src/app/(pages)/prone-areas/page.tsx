import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

export default function ProneAreas() {
  const floodProneAreas = [
    { brgy: "Bambang", areas: "BFAR / Rail Road" },
    { brgy: "Baybayin", areas: "Paciano" },
    { brgy: "Lalakay", areas: "Camp General Macario Sacay" },
    {
      brgy: "Malinta",
      areas: "Laguna State Polytechnic University ",
    },
    { brgy: "Mayondon", areas: "Kupangin Puntod / Punong Bundok" },
    { brgy: "Tadlac", areas: "Purok 1-A" },
  ];

  const landslideProneAreas = [
    { brgy: "Lalakay", areas: "Dampalit Watershed" },
    { brgy: "UPLB", areas: "Near MT. Makiling" },
    { brgy: "Bambang", areas: "Tigbi Watershed" },
  ];

  return (
    <div className=" justify-center h-screen md:mt-10">
      <div className="w-[90%] h-max flex flex-col gap-4  mx-auto  items-center ">
        <h2 className="md:text-xl text-sm font-bold mb-4 flex gap-4 items-center text-zinc-800 dark:text-zinc-100">
          <span>
            {" "}
            <Image
              src={"/images/proneareas.png"}
              alt="Prone Areas"
              width={35}
              height={35}
              className="object-cover object-center"
            />
          </span>
          Flood Prone Areas
        </h2>
      </div>

      {/* Flood Prone Areas Table */}
      <div className="w-full flex justify-center mt-2 md:mt-6 px-4">
        <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 pb-6">
            {/* Spacing wrapper */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold md:text-sm text-xs text-zinc-700 dark:text-zinc-200 py-4">
                    Barangay
                  </TableHead>
                  <TableHead className="font-bold md:text-sm text-xs text-zinc-700 dark:text-zinc-200 py-4">
                    Areas
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {floodProneAreas.map((item, index) => (
                  <TableRow
                    key={index}
                    className="even:bg-zinc-50 odd:bg-white dark:even:bg-zinc-800 dark:odd:bg-zinc-900 transition"
                  >
                    <TableCell className="font-medium text-zinc-800 md:text-sm text-[10px] dark:text-zinc-100 py-3 whitespace-normal break-words">
                      {item.brgy}
                    </TableCell>
                    <TableCell className="text-zinc-600 md:text-sm text-[10px] dark:text-zinc-300 py-3 whitespace-normal break-words">
                      {item.areas}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Landslide Prone Areas Table  */}
      <div className="w-[90%] h-max flex flex-col gap-4  mx-auto  items-center mt-16 ">
        <h2 className="md:text-xl text-sm font-bold mb-4 flex gap-4 items-center text-zinc-800 dark:text-zinc-100">
          <span>
            {" "}
            <Image
              src={"/images/landslideprone.png"}
              alt="Prone Areas"
              width={35}
              height={35}
              className="object-cover object-center"
            />
          </span>
          Landslide Prone Areas
        </h2>
      </div>

      {/* Landslide Prone Areas Table */}
      <div className="w-full flex justify-center mt-2 md:mt-6 px-4">
        <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6">
            {/* ✅ padding wrapper */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold md:text-sm text-xs text-zinc-700 dark:text-zinc-200 py-4">
                    Barangay
                  </TableHead>
                  <TableHead className="font-bold md:text-sm text-xs text-zinc-700 dark:text-zinc-200 py-4">
                    Areas
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {landslideProneAreas.map((item, index) => (
                  <TableRow
                    key={index}
                    className="even:bg-zinc-50 odd:bg-white dark:even:bg-zinc-800 dark:odd:bg-zinc-900 transition"
                  >
                    <TableCell className="font-medium text-zinc-800 md:text-sm text-[10px] dark:text-zinc-100 py-3 whitespace-normal break-words">
                      {item.brgy}
                    </TableCell>
                    <TableCell className="text-zinc-600 md:text-sm text-[10px] dark:text-zinc-300 py-3 whitespace-normal break-words">
                      {item.areas}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
